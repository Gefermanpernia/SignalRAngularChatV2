using AutoMapper;
using AutoMapper.QueryableExtensions;

using Microsoft.EntityFrameworkCore;

using SignalRDemo.DTOs;
using SignalRDemo.Entities;

using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRDemo.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly IMapper _mapper;

        public ChatRepository(ApplicationDbContext applicationDbContext,
            IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }

        public async Task<ChatRoom> CreateChatRoom(string RoomName)
        {
            if (string.IsNullOrEmpty(RoomName))
            {
                throw new NullReferenceException("RoomName can't be null");
            }

            var exist = await ChatRoomExist(RoomName);

            if(exist)
            {
                throw new DuplicateNameException($"{RoomName} already exist");
            }

            var chatRoom = new ChatRoom
            {
                Name = RoomName
            };

            _applicationDbContext.Add(chatRoom);

            await _applicationDbContext.SaveChangesAsync();

            return chatRoom;
        }

        public async Task RemoveChatRoom(int id)
        {
            var chatRoom = new ChatRoom
            {
                Id = id
            };


            _applicationDbContext.Entry(chatRoom).State = EntityState.Deleted;

            try
            {
                await _applicationDbContext.SaveChangesAsync();
            }

            catch (DbUpdateException)
            {

            }
        }
        public  Task<int> CountUsersInChatRoom(int id)
        {
            return _applicationDbContext.UserChatRooms.CountAsync(c => c.ChatRoomId == id);
        }

        public async Task<bool> JoinUserInChatRoom(User user, string RoomName)
        {
            var roomToJoin  = await GetRoomByName(RoomName);
            if (roomToJoin == null )
            {
                roomToJoin = await CreateChatRoom(RoomName);
            }

            var userChat = new UserChatRoom
            {
                UserId = user.Id,
                ChatRoomId = roomToJoin.Id
            };

            try
            {
                _applicationDbContext.UserChatRooms.Add(userChat);

                await _applicationDbContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return false;
            }

            return true;
        }




        public async  Task<bool> LeaveUserInChatRoom(User user, string RoomName)
        {
            var userChatRoom = await _applicationDbContext.UserChatRooms.Include(x => x.ChatRoom)
                .FirstOrDefaultAsync(c => c.ChatRoom.Name == RoomName && c.UserId == user.Id);

            if (userChatRoom != null)
            {
                _applicationDbContext.Attach(userChatRoom).State = EntityState.Deleted;
                var usersCount = await CountUsersInChatRoom(userChatRoom.ChatRoomId);
                if (usersCount <= 1)
                {
                    await RemoveChatRoom(userChatRoom.ChatRoomId);
                    return true;
                }

                await _applicationDbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<ChatRoom> GetRoomById(int id)
        {
            return await _applicationDbContext
                .ChatRooms.FindAsync(id);
        }
        public Task<ChatRoom> GetRoomByName(string roomName)
        {
            return  _applicationDbContext.ChatRooms
                .FirstOrDefaultAsync(c => c.Name == roomName);
        }
        public Task<bool> ChatRoomExist(string RoomName)
        {
            return _applicationDbContext.ChatRooms.AnyAsync(cr => cr.Name == RoomName);
        }

        public async Task<UserChatsDTO> GetUserChats(string userId)
        {
            var userChatNames =await _applicationDbContext.
                UserChatRooms.Where(c => c.UserId == userId)
                .Include(c => c.ChatRoom)
                .Select(c => c.ChatRoom.Name)
                .ToListAsync();

            return new UserChatsDTO
            {
                ChatNames = userChatNames
            };

        }

        public async Task<ChatInfoDTO> GetChat(string roomName)
        {
            var RoomQueryable = _applicationDbContext.ChatRooms
                .Where(r => r.Name == roomName)
                .Include(x => x.UserChats)
                .ThenInclude(x => x.User)
                .Include(x => x.ChatMessages)
                .ThenInclude(c => c.User);


            return await _mapper
                .ProjectTo<ChatInfoDTO>(RoomQueryable)
                .FirstOrDefaultAsync();

        }

        public async Task<ChatMessageDTO> SendMessage(string userId , SendMessageDTO sendMessageDTO)
        {

            var room = await GetRoomByName(sendMessageDTO.RoomName);
            if(room != null)
            {
                var message = new ChatMessage
                {
                    Content = sendMessageDTO.Content,
                    UserId = userId,
                    ChatRoomId =room.Id,
                    Date = DateTime.Now
                };
                _applicationDbContext.Add(message);

                await _applicationDbContext.SaveChangesAsync();

                return _mapper.Map<ChatMessage, ChatMessageDTO>(message);
            }
            return null;
        }

        public  Task<bool> UserIsInChat(string userId,string roomName)
        {
            return _applicationDbContext.UserChatRooms
                .Include(u=> u.ChatRoom)
                .AnyAsync(u => u.UserId == userId && u.ChatRoom.Name == roomName);
        }
    }
}
