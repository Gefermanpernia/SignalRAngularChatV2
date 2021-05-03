
using System.Collections.Generic;

namespace SignalRDemo.DTOs
{
    public class ChatInfoDTO :SimpleChatInfoDTO
    {
        public List<ChatMessageDTO> ChatMessages { get; set; } = new();
     
        public int MessagesCount { get; set; }
    }
}
