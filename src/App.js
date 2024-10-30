import {React, useEffect, useState} from 'react';
import classes from './App.module.css';
import {AppProvider, useAppContext} from './AppProvider.jsx';

const Root = () => {
  const {
    startPresentsPack,
    presentsConst,
    charactersConst,
    friendsConst,
    friendsList,
    users, setUsers
  } = useAppContext();

  const [continueButton, setContinueButton] = useState(true);

  const [hidenPresents, setHidenPresents] = useState([]);

  const [ideas, setIdeas] = useState([
    {'id': 0, 'value': ''},
    {'id': 0, 'value': ''},
    {'id': 0, 'value': ''},
    {'id': 0, 'value': ''}
  ]);

  const [isStart, setIsStart] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  const [round, setRound] = useState(1);

  const [buttonName, setButtonName] = useState('продолжить');

  const [selectIdea, setSelectIdea] = useState({'user': 0, 'id': 0});

  const [friendsResult, setFriendsResult] = useState([]);

  const [currentFriend, setCurrentFriend] = useState();

  const [showFriends, setShowFriends] = useState(false);

  const [score, setScore] = useState(0);

  useEffect(() => {
    if (friendsList[0]){
      setCurrentFriend(prevFriend => {
        let friend = {};
        let current = friendsList[round-1];
        friend['id'] = current.friend_name;
        friend['char'] = charactersConst.find(i => i.id === current.char_name).value[current.friend_gender];
        friend['name'] = friendsConst.find(i => i.id === current.friend_name).value;
        friend['char_type'] = current.char_type;
        friend['wish'] = 0;
        friend['present_id'] = current.present;
        friend['present_name'] = presentsConst.find(i => i.id === current.present).value;
        console.log(friend)
        return friend;
      });
    }
  }, [friendsList]);

  const presentClickHandler = (e) => {
    if (currentStep === 1){
      let user = e.currentTarget.getAttribute('data-user');
      let present_id = e.currentTarget.getAttribute('data-id');
      let present_value = e.currentTarget.getAttribute('data-value');
      setIdeas(prevIdeas => {
        let updatedIdeas = [...prevIdeas];
        updatedIdeas[user-1] = {'id': present_id, 'value': present_value};
        return updatedIdeas;
      })
      setHidenPresents(prevList => {
        let updatedList = [...prevList];
        let deletedIndex = updatedList.findIndex(i => i.user === user);
        console.log(deletedIndex)
        if (deletedIndex > -1){
          updatedList.splice(deletedIndex, 1);
        }
        updatedList.push({'user': user, 'present': present_id});
        return updatedList;
      })
    }
  }

  const startHandler = () => {
    setIsStart(true);
  }

  const nextHandler = () => {
    if (round < 13){
      let step = 1;
      let button = 'продолжить';
      let next = true;
      if (currentStep < 3){
        step = currentStep + 1;
      }
      if (step === 2){
        button = 'вручить подарок';
        let wish;
        ideas.forEach(i => {
          if (presentsConst.find(a => a.id === Number(i.id)).type === currentFriend.char_type){
            wish = i.id;
          }
        })
        if (!wish){
          users.forEach(a => {
            a.presents.forEach(b => {
              if (b.type === Number(currentFriend.char_type)){
                wish = b.id;
              }
            })
          })
          if (!wish){
            wish = ideas[randomizer(3)].id;
          }
        }
        setCurrentFriend(prevFriend => {
          let friend = {...prevFriend};
          friend.wish = wish;
          return friend;
        })
      }
      if (step === 3){
        setShowFriends(true);
        button = 'идём дальше';
        if (round === 12){
          button = 'возвращаемся домой';
        }
        next = false;
        let perfect_in = 0;
        if (selectIdea.id === currentFriend.wish){
          perfect_in = 1;
        } else {
          if (presentsConst.find(i => i.id === Number(selectIdea.id)).type === currentFriend.char_type){
            perfect_in = 2;
          }
        }
        let perfect_out = 0;
        if (presentsConst.find(i => i.id === currentFriend.present_id).type === Number(selectIdea.user)){
          perfect_out = 1;
        }
        let newScore = 0;
        if (perfect_in === 1){
          // newScore = 5;
          newScore = 1;
        } else if (perfect_in === 2){
          // newScore += 1;
        }
        if (perfect_out === 1){
          newScore += 1;
        }
        setScore(score + newScore);
        let friend_result = {};
        friend_result['name'] = currentFriend.name;
        friend_result['char'] = currentFriend.char;
        friend_result['perfect_in'] = perfect_in;
        friend_result['perfect_out'] = perfect_out;
        friend_result['present_in'] = presentsConst.find(i => i.id === Number(selectIdea.id)).value;
        friend_result['present_out'] = currentFriend.present_name;
        friend_result['present_who'] = users.find(i => i.id === Number(selectIdea.user)).name_alt;
        if (perfect_in !== 1){
          friend_result['present_wish'] = presentsConst.find(i => i.id === Number(currentFriend.wish)).value;
        } else {
          friend_result['present_wish'] = '';
        }
        setFriendsResult(prevResult => [...prevResult, friend_result]);
        setUsers(prevUsers => {
          let updatedUsers = [...prevUsers];
          let index = updatedUsers.findIndex(i => i.id === selectIdea.user);
          let index_present = updatedUsers[index].presents.findIndex(i => i.id === Number(selectIdea.id));
          updatedUsers[index].presents[index_present] = {
            id: Number(currentFriend.present_id), 
            type: presentsConst.find(i => i.id === Number(currentFriend.present_id)).type, 
            value: currentFriend.present_name
          };
          return updatedUsers;
        })
        setSelectIdea({'user': 0, 'id': 0});
        setIdeas([
          {'id': 0, 'value': ''},
          {'id': 0, 'value': ''},
          {'id': 0, 'value': ''},
          {'id': 0, 'value': ''}
        ]);
        setHidenPresents([]);
      }
      setContinueButton(next);
      setButtonName(button);
      if (step === 1){
        setRound(round + 1);
      }
      setCurrentStep(step);
    }
  }

  useEffect(() => {
    if (round > 1 && round < 13){
      setCurrentFriend(prevFriend => {
        let friend = {};
        let current = friendsList[round-1];
        friend['id'] = current.friend_name;
        friend['char'] = charactersConst.find(i => i.id === current.char_name).value[current.friend_gender];
        friend['name'] = friendsConst.find(i => i.id === current.friend_name).value;
        friend['char_type'] = current.char_type;
        friend['wish'] = 0;
        friend['present_id'] = current.present;
        friend['present_name'] = presentsConst.find(i => i.id === current.present).value;
        console.log(friend)
        return friend;
      });
    }
  }, [round]);

  const selectIdeaHandler = (e) => {
    if (currentStep === 2){
      let id = e.currentTarget.getAttribute('data-id');
      let user = e.currentTarget.getAttribute('data-user');
      setSelectIdea({'user': Number(user)+1, 'id': id});
      setContinueButton(false);
    }
  }

  console.log(hidenPresents)

  useEffect(() => {
    let status = false;
    if (currentStep === 1){
      ideas.forEach(i => {
        if (i.id === 0){
          status = true;
        }
      })
    }
    setContinueButton(status);
  }, [ideas]);

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
      isStart ? 
      <div className={`${classes['main']}`}>
        <div className={`${classes['game-board-main']}`}>
          <div className={`${classes['sideblock-left']}`} style={{'opacity': round < 13 ? 1 : 0}}>
            <div className={`${classes['ideas-div']}`}>
              <div className={`${classes['ideas-list-div']}`}>
                {ideas.map((i, index) => 
                  <div className={`${classes['idea-div']}`} key={index}>
                    <div 
                      className={`${classes['idea-pic']}`}
                      data-user={index} 
                      data-id={i.id} 
                      onClick={selectIdeaHandler}
                      data-disabled={currentStep === 2 ? 'false' : 'true'}
                      style={{'backgroundImage': `url('${process.env.PUBLIC_URL}/img/presents/${i.id}.jpg')`}}>
                        {/* {i.id} */}
                    </div>
                    <div 
                      className={`${classes['idea-description']}`} 
                      data-user={index} 
                      data-id={i.id} 
                      onClick={selectIdeaHandler}
                      data-active={selectIdea.id === i.id ? 'true' : 'false'}
                      data-disabled={currentStep === 2 ? 'false' : 'true'}>
                        {i.value}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`${classes['button-next-div']}`}>
              <button className={`${classes['button-next']}`} data-disabled={continueButton} disabled={continueButton} onClick={nextHandler} style={{'opacity': continueButton ? 0 : 1}}>{buttonName}</button>
            </div>
          </div>
          <div className={`${classes['character-div']}`} style={{'opacity': currentStep > 1 ? 1 : 0}}>
            <div className={`${classes['portrait-title']}`}>
              {['домосед', 'кулинар', 'карьерист', 'карьеристка'].includes(currentFriend.char) ? 
                `${currentFriend.name}-${currentFriend.char}` : 
                `${currentFriend.char} ${currentFriend.name}`
              }
            </div>
            <div className={`${classes['portrait']}`} style={{'backgroundImage': `url('${process.env.PUBLIC_URL}/img/friends/${currentFriend.id}.jpg')`}}></div>
          </div>
          <div className={`${classes['sideblock-right']}`} style={{'opacity': showFriends ? 1 : 0}}>
            <div className={`${classes['friends-div']}`}>
              <div style={{'width': '100%'}}>
                <div className={classes['friends-list-table']}>
                  <div className={classes['friends-list-header']}>
                    <div></div>
                    <div>что получил</div>
                    <div>что подарил</div>
                    <div>кому</div>
                  </div>
                  {friendsResult.map((i, index) => 
                    <div key={index} className={classes['friends-list-row']}>
                      <div className={classes['friends-list-row-info']}>
                        <div>
                          <p className={classes['friends-list-name']}>{i.char}</p>
                          <p className={classes['friends-list-name']}>{i.name}</p>
                        </div>
                        <div 
                          style={{'fontWeight': `${(i.perfect_in === 1 || i.perfect_in === 2) ? '600' : '400'}`, 'color': `${i.perfect_in === 1 ? '#008a00' : i.perfect_in === 2 ? 'blue' : 'black'}`}}>
                            {i.present_in}
                            {i.perfect_in !== 1 ? <p className={classes['friends-list-row-wish']}>({i.present_wish})</p> : ''}
                          </div>
                        <div style={{'fontWeight': `${i.perfect_out === 1 ? '600' : '400'}`, 'color': `${i.perfect_out === 1 ? '#008a00' : 'black'}`}}>{i.present_out}</div>
                        <div>{i.present_who}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`${classes['score']}`}><div className={`${classes['score-icon']}`}></div><span className={`${classes['score-span']}`}>{score}</span></div>
          </div>
        </div>
        <div className={`${classes['presents-main']}`}>
          {users.map(i => 
            <div className={`${classes['present-main']}`} key={i.id}>
              <div className={`${classes['player-name']}`}>{i.name}</div>
              <div className={`${classes['present-div']}`}>
                <div 
                  className={`${classes['present']}`} 
                  onClick={presentClickHandler} 
                  data-id={i.presents[0].id} 
                  data-value={i.presents[0].value} 
                  data-user={i.id}
                  data-disabled={currentStep === 1 ? 'false' : 'true'}
                  style={{'backgroundImage': `url('${process.env.PUBLIC_URL}/img/presents/${i.presents[0].id}.jpg')`}}
                  data-hide={hidenPresents.findIndex(a => a.present === String(i.presents[0].id)) > -1 ? 'true' : 'false'}>
                </div>
                <div 
                  className={`${classes['present']}`} 
                  onClick={presentClickHandler} 
                  data-id={i.presents[1].id}
                  data-value={i.presents[1].value} 
                  data-user={i.id}
                  data-disabled={currentStep === 1 ? 'false' : 'true'}
                  style={{'backgroundImage': `url('${process.env.PUBLIC_URL}/img/presents/${i.presents[1].id}.jpg')`}}
                  data-hide={hidenPresents.findIndex(a => a.present === String(i.presents[1].id)) > -1 ? 'true' : 'false'}>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      : <div className={`${classes['start']}`}>
        <button className={`${classes['button-start']}`} onClick={startHandler}>отправляемся на прогулку</button>
      </div>
  );
}

const App = () => (
  <AppProvider>
    <Root />
  </AppProvider>
);

export default App;