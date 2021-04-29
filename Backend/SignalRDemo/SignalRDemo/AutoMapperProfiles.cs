using AutoMapper;

using SignalRDemo.DTOs;
using SignalRDemo.Entities;

namespace SignalRDemo
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<ChatRoom, ChatInfoDTO>()
                .ForMember(c => c.Integrants,
                options => options.MapFrom(p => p.UserChats));

            CreateMap<UserChatRoom, UserInfoDTO>()
                .ForMember(u => u.UserName, options => options.MapFrom(u => u.User.UserName));

            CreateMap<ChatMessage, ChatMessageDTO>()
                .ForMember(x => x.UserInfo, options => options.MapFrom(u => u.User));

            CreateMap<User, UserInfoDTO>()
                .ForMember(u => u.UserId, options => options.MapFrom(u => u.Id));

        }
    }
}
