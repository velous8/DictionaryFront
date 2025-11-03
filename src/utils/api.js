export const getAllWords = async () => {
    const response = await fetch('http://localhost:3000/word')
    return response.json();
}

export const getKnownWord = async (ids) => {
    const response = await fetch(`http://localhost:3000/word/known`, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ids: ids
        })
    });
    return response.json();
}

export const getUnknownWord = async (ids, amount) => {
    const response = await fetch(`http://localhost:3000/word/unknown/${amount}`, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ids: ids
        })
    });
    
    return response.json();
}