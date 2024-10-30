import {React, createContext, useContext, useState, useEffect} from 'react';

const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

const AppProvider = (({children}) => {
    const presentsConst = [
        {'id': 1, 'type': 1, 'value': 'счёты'},
        {'id': 2, 'type': 1, 'value': 'будильник'},
        {'id': 3, 'type': 1, 'value': 'галстук'},
        {'id': 4, 'type': 1, 'value': 'глобус'},
        {'id': 5, 'type': 1, 'value': 'лупа'},
        {'id': 6, 'type': 2, 'value': 'варенье'},
        {'id': 7, 'type': 2, 'value': 'плед'},
        {'id': 8, 'type': 2, 'value': 'чайный набор'},
        {'id': 9, 'type': 2, 'value': 'сковородка'},
        {'id': 10, 'type': 2, 'value': 'клубок ниток'},
        {'id': 11, 'type': 3, 'value': 'краски'},
        {'id': 12, 'type': 3, 'value': 'укулеле'},
        {'id': 13, 'type': 3, 'value': 'карандаши'},
        {'id': 14, 'type': 3, 'value': 'мольберт'},
        {'id': 15, 'type': 3, 'value': 'перо'},
        {'id': 16, 'type': 4, 'value': 'сачок'},
        {'id': 17, 'type': 4, 'value': 'удочка'},
        {'id': 18, 'type': 4, 'value': 'мяч'},
        {'id': 19, 'type': 4, 'value': 'ракетка'},
        {'id': 20, 'type': 4, 'value': 'скакалка'}
    ];

    const charactersConst = [
        {'id': 1, 'type': 1, 'value': {0: 'карьерист', 1: 'карьеристка'}},
        {'id': 2, 'type': 1, 'value': {0: 'начитанный', 1: 'начитанная'}},
        {'id': 3, 'type': 1, 'value': {0: 'деловой', 1: 'деловая'}},
        {'id': 4, 'type': 2, 'value': {0: 'кулинар', 1: 'кулинар'}},
        {'id': 5, 'type': 2, 'value': {0: 'хозяйственный', 1: 'хозяйственная'}},
        {'id': 6, 'type': 2, 'value': {0: 'домосед', 1: 'домосед'}},
        {'id': 7, 'type': 3, 'value': {0: 'творческий', 1: 'творческая'}},
        {'id': 8, 'type': 3, 'value': {0: 'талантливый', 1: 'талантливая'}},
        {'id': 9, 'type': 3, 'value': {0: 'романтичный', 1: 'романтичная'}},
        {'id': 10, 'type': 4, 'value': {0: 'спортивный', 1: 'спортивная'}},
        {'id': 11, 'type': 4, 'value': {0: 'подтянутый', 1: 'подтянутая'}},
        {'id': 12, 'type': 4, 'value': {0: 'непоседливый', 1: 'непоседливая'}},
    ];

    const friendsConst = [
        {'id': 1, 'value': 'барсук', 'gender': 0},
        {'id': 2, 'value': 'медведь', 'gender': 0},
        {'id': 3, 'value': 'ёжик', 'gender': 0},
        {'id': 4, 'value': 'совушка', 'gender': 1},
        {'id': 5, 'value': 'бобр', 'gender': 0},
        {'id': 6, 'value': 'лисичка', 'gender': 1},
        {'id': 7, 'value': 'выдра', 'gender': 1},
        {'id': 8, 'value': 'волк', 'gender': 0},
        {'id': 9, 'value': 'зайка', 'gender': 1},
        {'id': 10, 'value': 'хомячок', 'gender': 0},
        {'id': 11, 'value': 'рысь', 'gender': 1},
        {'id': 12, 'value': 'косуля', 'gender': 1}
    ]

    let characters = [...charactersConst];

    characters = shuffleList(characters);

    let friends = [...friendsConst];

    friends = shuffleList(friends);

    let presents = [...presentsConst];

    let startPresentsPack = [];

    let presentsListForWish = [];

    let counts = {1: 0, 2: 0, 3: 0, 4: 0};

    presents = shuffleList(presents);

    const [users, setUsers] = useState([
        {'presents': [0, 0], 'name': 'Папуля', 'name_alt': 'Папуле', 'id': 1},
        {'presents': [0, 0], 'name': 'Мамуля', 'name_alt': 'Мамуле', 'id': 2},
        {'presents': [0, 0], 'name': 'Сашуля', 'name_alt': 'Сашуле', 'id': 3},
        {'presents': [0, 0], 'name': 'Вася', 'name_alt': 'Васе', 'id': 4}
    ]);

    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        for (let i=1; i<=4; i++){
            while(counts[i] < 2){
                let index = presents.findIndex(a => a.type === i);
                startPresentsPack.push(presents[index]);
                presentsListForWish.push({'type': i, 'id': presents[index].id});
                presents.splice(index, 1);
                counts[i]++;
            }
        }
    
        startPresentsPack = shuffleList(startPresentsPack);
    
        presentsListForWish = shuffleList(presentsListForWish);
    
        counts = {1: 0, 2: 0, 3: 0, 4: 0};
    
        let counter = 1;

        let friendsPrepare = [];
    
        for (let i=1; i<=4; i++){
            while(counts[i] < 3){
                let present;
    
                // if (counts[i] === 0){
                //     present = presents.findIndex(a => a.type === i);
                // } else {
                //     present = randomizer(presents.length - 1);
                // }

                present = randomizer(presents.length - 1);

                if (present > -1){
                
                    let char_index = characters.findIndex(a => a.type === i);
                    let char_name = characters[char_index].id;
        
                    let friend_index = randomizer(characters.length - 1);
                    let friend_name = friends[friend_index].id;
                    let friend_gender = friends[friend_index].gender;
        
                    let friend = {'id': counter, 'friend_gender': friend_gender, 'friend_name': friend_name, 'char_name': char_name, 'char_type': i, 'present': presents[present].id, 'wish': 0};

                    friendsPrepare.push(friend);
        
                    presents.splice(present, 1);
                    characters.splice(char_index, 1);
                    friends.splice(friend_index, 1);
                } else {
                    alert('!');
                    console.log(i);
                    console.log(presents);
                }

                counter++;
                counts[i]++;
            }
        }
    
        friendsPrepare = shuffleList(friendsPrepare);

        setFriendsList(friendsPrepare);
    
        // friendsList.forEach(i => {
            // let isStack = true;
            // let wishId = presentsListForWish.findIndex(a => a.type === i.char_type);
    
            // console.log(`${charactersConst.find(a => a.id === i.char_name).value[i.friend_gender]} | ${friendsConst.find(a => a.id === i.friend_name).value} | ${presentsConst.find(a => a.id === i.present).value} | ${presentsConst.find(a => a.id === presentsListForWish[wishId].id).value}`);
    
            // if (isStack){
            //     presentsListForWish.splice(wishId, 1);
            //     presentsListForWish.push({'type': presentsConst.find(a => a.id === i.present).type, 'id': i.present});
            // }
        // })

        const newUsers = [...users];
        for (let i = 1; i <= 4; i++){
            newUsers[i-1].presents = [startPresentsPack[(i*2)-2], startPresentsPack[(i*2)-1]];
        }
        setUsers(newUsers);
    }, []);

    const value = {
        startPresentsPack,
        friendsList,
        friendsConst,
        charactersConst,
        presentsConst,
        users, setUsers
    }

    function shuffleList(array){
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function randomizer(max){
        if (max === 0){
            return 0;
        } else {
            let min = 0;
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    return (
        <AppContext.Provider
            value={value}>
            {children}
        </AppContext.Provider>
    );
});

export {AppProvider, useAppContext};