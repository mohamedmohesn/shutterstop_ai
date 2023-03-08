const button = document.querySelector('#buttonsubmit')

button.onclick = () => {
    console.log('Clicked')
    const input = document.getElementById('inputImage').value

    console.log('Clicked')

    if (!input || typeof input != 'string') return
    if (input.length == 0) return

    const findByFace = document.getElementById('findByPace').checked
    const genderEmotions = document.getElementById('genderEmotions').checked
    if (genderEmotions) {
        axios.get('http://localhost:5000/image', {
            headers: {
                'Content-Type': "application/json"
            },
            params: {
                imageURL: input
            }
        }).then(res => {
            console.log(res.data.data)
            if (res.data.data) {
                var div = document.createElement('div');
                div.id = 'divId';
                document.querySelector('.container').appendChild(div);
                let span1 = document.createElement('span')
                span1.innerHTML = `Persons Number: ${res.data.data.analytics.personsCount}`
                let ul = document.createElement('ul');
                div.appendChild(span1)

                res.data.data.analytics.persons.map(det => {
                    const li = document.createElement('li')
                    li.innerHTML = `
                    AgeRange: ${det.AgeRange.Low + " - " + det.AgeRange.High  } ||
    
                    Gender: ${det.Gender} ||
    
                    Emition: ${det.Emotions[0] ? det.Emotions[0].Type : 'Not appeared' }
                    `

                    JSON.stringify(det)
                    ul.appendChild(li)
                })
                const image = document.createElement('img')
                image.className = 'photoOfPersons'
                image.src = input
                div.appendChild(ul)
                div.appendChild(image)
                div.appendChild(canvases)


            }

        }).catch(error => {
            console.log(error)
        })
    } else if (findByFace) {
        axios.get('http://localhost:5000/image/face', {
            headers: {
                'Content-Type': "application/json"
            },
            params: {
                imageURL: input
            }
        }).then(res => {
            console.log(res.data.data)
            if (res.data.data) {
                var div = document.createElement('div');
                div.id = 'divId2';
                document.querySelector('.container').appendChild(div);
                if (res.data.data.photos) {
                    res.data.data.photos.map(photo => {
                        const image = document.createElement('img')
                        image.className = 'photoOfPersons'
                        image.src = photo
                        console.log(image)
                        return div.appendChild(image)
                    })
                }
            }

        }).catch(error => {
            console.log(error)
        })


    }


}