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

export const getIncompleteProgressIds = (num) => {
    const words = getProgress().filter(item => item.progress < 100).map(item => item.id);
    const shuffled = [...words].sort(() => 0.5 - Math.random());  
    return shuffled.slice(0, num); 
}

export const addProgress = (ids) => {
    let bufDeletProgress = []
    const result = ids.map((item) => {
        const progressItem = getProgress().find((progress) => {
            return progress.id === item
        })

        if(progressItem) {
            progressItem.progress += 10
            bufDeletProgress.push(item)
            return progressItem
        } else {
            return {id:item, progress: 10}
        }    
    })

    getProgress().map((item) => {
        const x = ids.find((id) => {
            return item.id === id
        })

        if(!x) {
            result.push(item)
        }
    })

    saveProgress(result)
}

export const writeNewProgress = (id, progress) => {
    const saved = getProgress();
    saved.push({id, progress});
    saveProgress(saved);
}
