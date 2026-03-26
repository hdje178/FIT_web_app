import type { EventItemsDto, EventResponseDto } from "./event.dto.js";
import type {UserDto, UserResponseDto} from "./user.dto.js";
import type {RegistrationDto, RegistrationResponseDto} from "./registrations.dto.js";

export function mapEventToView(event: EventItemsDto): EventResponseDto {
  return {
    id: event.id,
    name: event.name,
    date: event.date,
    location: event.location,
    capacity: event.capacity,
  };
}
export function mapUserToView(user: UserDto): UserResponseDto {
    return {
    id: user.id,
    email: user.email,
    role: user.role
    };
}
export function mapRegistrationToView(registration: RegistrationDto): RegistrationResponseDto {
    return {
        id: registration.id,
        userId: registration.userId,
        eventId: registration.eventId,
        status: registration.status,
    };
}