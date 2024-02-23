export const register = async (message) => {
    try {
        const alreadyRegistered = await pool.query(
            `SELECT 1 FROM public.player_stats WHERE discord_id = $1`,
            [message.author.id]
        );
        if (alreadyRegistered.rowCount > 0) {
            sendMessage('You are already registered.');
        } else {
            const startHp = 100;
            await pool.query(
                `INSERT INTO public.player_stats (discord_id, name, health) VALUES ($1, $2, $3)`,
                [message.author.id, message.author.username, startHp]
            );
            sendMessage('You have been successfully registered.');
        }
    } catch (error) {
        console.error(error);
        sendMessage('Failed to register your character. Try again later.');
    }
}