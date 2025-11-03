export const getProgress = () => {
    try {
        return JSON.parse(localStorage.getItem('progressWords')) || [];
    } catch (error) {
        return [];
    }
}

export const loadProgress = (wordList) => {
    return wordList.map((item) => {
        const progressItem = getProgress().find((progress) => {
            return progress.id === item._id
        })
        return {...item, progress:  progressItem ? progressItem.progress : 0}
    })   
}

export const saveProgress = (words) => {
    return localStorage.setItem('progressWords', JSON.stringify(words))
}

export const getProgressIds = () => {
    return getProgress().map(item => item.id);
}

export const getIncompleteProgressIds = () => {
    return getProgress().filter(item => item.progress < 100).map(item => item.id);
}