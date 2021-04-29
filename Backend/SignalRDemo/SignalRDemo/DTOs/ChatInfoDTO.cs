
using System.Collections.Generic;

namespace SignalRDemo.DTOs
{
    public class ChatInfoDTO
    {
        public List<ChatMessageDTO> ChatMessages { get; set; } = new();
        public string Name { get; set; }

        public List<UserInfoDTO> Integrants { get; set; }
    }
}
