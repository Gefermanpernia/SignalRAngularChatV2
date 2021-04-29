using System.Collections.Generic;

namespace SignalRDemo.Entities
{
    public class ChatRoom
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public  List<ChatMessage> ChatMessages { get; set; }

        public List <UserChatRoom> UserChats { get; set; }

    }
}
