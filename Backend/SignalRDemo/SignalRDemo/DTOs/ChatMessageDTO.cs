using System;

namespace SignalRDemo.DTOs
{
    public class ChatMessageDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }

        public UserInfoDTO UserInfo { get; set; }
    }
}
