using SignalRDemo.DTOs;
using SignalRDemo.Entities;

using System.Threading.Tasks;

namespace SignalRDemo.Repositories
{
    public interface IChatRepository
    {
        public Task<bool> JoinUserInChatRoom(User user, string RoomName);
        public Task<bool> LeaveUserInChatRoom(User user, string RoomName);

        public Task<ChatRoom> CreateChatRoom(string RoomName);
        Task<bool> ChatRoomExist(string RoomName);
        public Task<UserChatsDTO> GetUserChats(string userId);
        public Task<ChatInfoDTO> GetChat(string roomName);
        Task<ChatMessageDTO> SendMessage(string userId, SendMessageDTO sendMessageDTO);
        Task<bool> UserIsInChat(string userId, string roomName);
    }
}
