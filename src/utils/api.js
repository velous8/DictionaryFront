export const getAllWords = async () =>{
    const response = await fetch('http://localhost:3000/word')
    return response.json();
}