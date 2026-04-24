export async function updateField(field, updateFunction, setLoading, getFunction) {
    if (field === null) {
        setLoading(true);
    }
    try {
        const usersData = await getFunction();
        updateFunction(usersData);
    } finally {
        setLoading(false);
    }
}