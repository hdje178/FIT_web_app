import type {
    RegistrationDbDto,
    RegistrationDto,
    CreateRegistrationDto,
    UpdateRegistrationPutDto,
    UpdateRegistrationPatchDto, UserRegistrationsDto
} from "../dto/registrations.dto.js";
import { mapFromDbtoRegistrationDto } from "../dto/dto.func.js";
import { all, get, run } from "../db/dbClient.js";
import type { RunResult } from "../db/dbClient.js";
import type {Paginated} from "../types/pagineted.type.js";



export async function getRegistrations(): Promise<Paginated<RegistrationDto>> {
    const sql = `SELECT 
        registration_id,
        user_id,
        event_id,
        status,
        created_at,
        updated_at,
        description
      FROM Registrations 
      ORDER BY registration_id DESC`;
    const registrationsDb: RegistrationDbDto[] = await all<RegistrationDbDto>(sql);
    const total: number = registrationsDb.length;
    return {data: registrationsDb.map(mapFromDbtoRegistrationDto), total};
}

export async function getRegistrationById(id: number): Promise<RegistrationDto | null> {
    const sql = `SELECT 
        registration_id,
        user_id,
        event_id,
        status,
        created_at,
        updated_at,
        description
      FROM Registrations WHERE registration_id = ?`;
    const registrationDb: RegistrationDbDto | null = await get<RegistrationDbDto>(sql, [Number(id)]);
    if (!registrationDb) return null;
    return mapFromDbtoRegistrationDto(registrationDb);
}
export async function addRegistration(payload: CreateRegistrationDto): Promise<RegistrationDto | null> {
    const sql = "INSERT INTO Registrations(user_id, event_id, status, description) VALUES (?, ?, ?, ?)";
    const runResult: RunResult = await run(sql, [Number(payload.userId), Number(payload.eventId), payload.status ?? 'pending', payload.description ?? null]);
    const created = await getRegistrationById(runResult.lastID);
    return created;
}

export async function updateRegistrationPut(
    id: number,
    payload: UpdateRegistrationPutDto
): Promise<RunResult> {

    const sql =
        "UPDATE Registrations SET status = ?, description = ?, updated_at = datetime('now') WHERE registration_id = ?";

    return run(sql, [
        payload.status,
        payload.description,
        Number(id)
    ]);
}

export async function updateRegistrationPatch(
    id: number,
    payload: UpdateRegistrationPatchDto
): Promise<RunResult> {

    const fields: string[] = [];
    const values: any[] = [];

    if (payload.status !== undefined) {
        fields.push("status = ?");
        values.push(payload.status);
    }
    if (payload.description !== undefined) {
        fields.push("description = ?");
        values.push(payload.description);
    }

    fields.push("updated_at = datetime('now')");

    const sql = `
        UPDATE Registrations
        SET ${fields.join(", ")}
        WHERE registration_id = ?
    `;

    values.push(Number(id));

    return run(sql, values);
}

export async function deleteRegistration(id: number): Promise<boolean | null> {
    const runResult: RunResult = await run("DELETE FROM Registrations WHERE registration_id = ?", [Number(id)]);
    if (runResult.changes === 0) return null;
    return true;
}
