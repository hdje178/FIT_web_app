import { run } from "./dbClient.js";


async function seed() {
  console.log("[seed] Starting seed process...");


  try {
    await run("BEGIN");

    console.log("[seed] Cleaning existing data...");

    await run("DELETE FROM Registrations");
    await run("DELETE FROM Users");
    await run("DELETE FROM Events");

    await run("DELETE FROM sqlite_sequence WHERE name IN ('Users','Events','Registrations')");

    console.log("[seed] Inserting Users...");
    const demoHash = "$2a$10$2cXlq5zD0L17dH1c6y0JfO1m7v7bq9bWv2RrB3b2fXq3s2rXrN7bO";
    await run(
      `INSERT INTO Users(name, email, password, role) VALUES
        ('Alice', 'alice@example.com', '${demoHash}', 'USER'),
        ('Bob', 'bob@example.com', '${demoHash}', 'USER'),
        ('Carol', 'carol@example.com', '${demoHash}', 'USER')`
    );

    console.log("[seed] Inserting Events...");
    await run(
      `INSERT INTO Events(name, date, location, capacity, description) VALUES
        ('JS Conf', '2027-04-15T10:00:00.000Z', 'Kyiv', 100, 'JavaScript community meetup'),
        ('Node Meetup', '2027-05-20T18:00:00.000Z', 'Lviv', 80, 'Evening meetup'),
        ('Frontend Day', '2027-06-10T09:30:00.000Z', 'Odesa', 120, 'React/Vue/Svelte talks')`
    );

    console.log("[seed] Inserting Registrations...");
    await run(
      `INSERT INTO Registrations(user_id, event_id, status, description) VALUES
        (1, 1, 'confirmed', 'Early bird'),
        (2, 1, 'pending', 'Looking forward'),
        (2, 2, 'confirmed', 'VIP attendee'),
        (3, 3, 'pending', 'First time here')`
    );

    await run("COMMIT");
    console.log("[seed] Seed completed successfully.");
  } catch (e) {
    await run("ROLLBACK");
    console.error("[seed] Seed failed:", e);
    throw e;
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
