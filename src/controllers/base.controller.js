export const getDataToken = (req, res) => {
    try {
        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;

        return res.json({ message: 'ok', rol: rol, id: id });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}