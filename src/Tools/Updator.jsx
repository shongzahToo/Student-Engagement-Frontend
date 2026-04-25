/**
 * Fetches data using a provided async function and updates state accordingly,
 * while managing a loading indicator.
 *
 * @param {*} field - The current value of the field; used to determine whether to show loading.
 * @param {Function} updateFunction - Function to update the state with fetched data.
 * @param {Function} setLoading - Function to toggle the loading state.
 * @param {Function} getFunction - Async function that retrieves the data.
 */
export async function updateField(field, updateFunction, setLoading, getFunction) {
    let usersData = null;
    if (field === null) {
        setLoading(true);
    }
    try {
        usersData = await getFunction();
    } finally {
        updateFunction(usersData);
        setLoading(false);
    }
}