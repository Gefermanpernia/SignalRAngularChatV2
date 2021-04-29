using System;

namespace SignalRDemo.Entities
{
    public class ChatMessage 
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string UserId { get; set; }
        public DateTime Date{ get; set; }
        public User User { get; set; }

        public int ChatRoomId { get; set; }
        public ChatRoom ChatRoom { get; set; }
    }
}
