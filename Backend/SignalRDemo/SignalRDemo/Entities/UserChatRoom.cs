namespace SignalRDemo.Entities
{
    public class UserChatRoom
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public int ChatRoomId { get; set; }

        public ChatRoom ChatRoom { get; set; }
    }
}
