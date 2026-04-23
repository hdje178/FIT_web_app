import type { EventItemsDto, EventResponseDto , EventDbDto} from "./event.dto.js";
import type {UserDto, UserResponseDto, UserDbDto} from "./user.dto.js";
import type {RegistrationDto, RegistrationResponseDto, RegistrationDbDto} from "./registrations.dto.js";

export function mapEventToView(event: EventItemsDto): EventResponseDto {
  return {
    id: event.id,
    name: event.name,
    date: event.date,
    location: event.location,
    capacity: event.capacity,
    description: event.description,
  };
}
export function mapUserToView(user: UserDto): UserResponseDto {
    return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
    };
}
export function mapFromDbtoEventDto(event:EventDbDto):EventItemsDto{
    return {
        id: event.event_id,
        name: event.name,
        date: event.date,
        capacity: event.capacity,
        location: event.location,
        description: event.description,
        createdAt: new Date(event.created_at).toISOString(),
        updatedAt: new Date(event.updated_at).toISOString(),
    }
}
export function mapFromDbtoUserDto(user:UserDbDto):UserDto{
    return {
        id: user.user_id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: new Date(user.created_at).toISOString(),
        updatedAt: new Date(user.updated_at).toISOString(),
    }

}
export function mapFromDbtoRegistrationDto(registration:RegistrationDbDto):RegistrationDto{
    return {
        id: registration.registration_id,
        userId: registration.user_id,
        eventId: registration.event_id,
        status: registration.status,
        createdAt: registration.created_at,
        updatedAt: registration.updated_at,
        description: registration.description ?? ""
    }
}
export function mapRegistrationToView(registration: RegistrationDto): RegistrationResponseDto {
    return {
        id: registration.id,
        userId: registration.userId,
        eventId: registration.eventId,
        status: registration.status,
        description: registration.description?? "",
    };
}
