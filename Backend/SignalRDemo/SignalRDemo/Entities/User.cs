using Microsoft.AspNetCore.Identity;

using System.Collections.Generic;

namespace SignalRDemo.Entities
{
    public class User : IdentityUser
    {
        public List<ChatMessage> ChatMessages{ get; set; }

    }
}
