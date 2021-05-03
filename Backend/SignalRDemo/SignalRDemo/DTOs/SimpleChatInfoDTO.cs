using System.Collections.Generic;

namespace SignalRDemo.DTOs
{
    public class SimpleChatInfoDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<UserInfoDTO> Integrants { get; set; }
    }
}
