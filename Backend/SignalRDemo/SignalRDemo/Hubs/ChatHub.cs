using AutoMapper;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

using SignalRDemo.DTOs;
using SignalRDemo.Entities;
using SignalRDemo.ExtensionMethods;
using SignalRDemo.Repositories;

using System.Threading.Tasks;

namespace SignalRDemo.Hubs
{
    [Authorize(AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        private readonly IChatRepository _chatRepository;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public ChatHub(IChatRepository chatRepository, UserManager<User> userManager,
            IMapper mapper)
        {
            _chatRepository = chatRepository;
            _userManager = userManager;
            _mapper = mapper;
        }
        public async Task JoinRoom(string roomName)
        {
            var currentUser = await Context.GetUserFromContext(_userManager);

            if (currentUser != null)
            {
                if(!(await _chatRepository.UserIsInChat(currentUser.Id, roomName)))
                {
                     await _chatRepository.JoinUserInChatRoom(currentUser, roomName);
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

                var userInfo = _mapper.Map<UserInfoDTO>(currentUser);
                await Clients.OthersInGroup(roomName).SendAsync("UserJoin", userInfo);
                var chatInfo = await _chatRepository.GetChat(roomName);
                await Clients.Caller.SendAsync("ChatInfo", chatInfo);
            }
        }

        public async Task LeaveRoom(string roomName)
        {
            var currentUser = await Context.GetUserFromContext(_userManager);

            if (currentUser != null && await _chatRepository.UserIsInChat(currentUser.Id,roomName))
            {
                await _chatRepository.LeaveUserInChatRoom(currentUser, roomName);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
                var userInfo = _mapper.Map<UserInfoDTO>(currentUser);
                await Clients.OthersInGroup(roomName).SendAsync("UserLeave", userInfo);

            }
        }
        //localhost//chathub//sendMessage
        public async Task SendMessage(SendMessageDTO chatMessageDTO)
        {
            
            var currentUser = await Context.GetUserFromContext(_userManager);
            if (currentUser != null && await _chatRepository.UserIsInChat(currentUser.Id, chatMessageDTO.RoomName))
            {
                var message =  await _chatRepository.SendMessage(currentUser.Id, chatMessageDTO);
                await Clients.OthersInGroup(chatMessageDTO.RoomName).SendAsync("NewMessageReceived", message);
            }

        }



    }
}
