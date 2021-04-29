using System;

namespace SignalRDemo.DTOs
{
    public class JwtResponse
    {
        public DateTime Expiration { get; set; }
        public string Token { get; set; }
    }
}
