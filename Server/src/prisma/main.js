import 'dotenv/config';
import { db } from './db.js';

async function main() {
    try {
        const url = process.env.DATABASE_URL;

        if (!url) {
            throw new Error('DATABASE_URL is missing from .env');
        }

        // Explicitly bind the PostgreSQL connection
        await db.connect({ url });

        console.log('Connected to PostgreSQL!');

        const created = await db.orm.public.Note.create({
            patientId: '123',
            practitionerId: '234',
            message: 'This is a test note'
        });

        console.log('Created note:');
        console.dir(created, { depth: null });

        const notes = await db.orm.public.Note.all();

        console.log('All notes:');
        console.dir(notes, { depth: null });

    } finally {
        await db.close();
    }
}

main().catch(error => {
    console.error('Database test failed:', error);
    process.exitCode = 1;
});
