import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { KakaoLogin } from 'components';
import { axios } from 'utils';
import * as styled from "./style";
import { RootState } from 'store/reducers/interface';
import { HomeImage } from 'assets';
import { login } from 'store/reducers/user';
import { UserState, State } from 'store/reducers/user/interface';
import qs from 'qs';

const Home: React.FC = _ => {
  const [key, setKey] = useState(null);
  let history = useHistory();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const url = window.location.href.split('?');
    if (url.length > 1) {
      const queryParams = url[1];
      const parseKey = qs.parse(queryParams);
      setKey(parseKey['key']);
    }
  }, []);

  useEffect(() => {
    if (user && key) {
      const asyncMethod = async () => {
        let payload: any = {};
        payload['url'] = key;
        const res = await axios.post('/login', payload);
        const { data } = res;

        if (data) {
          dispatch(login(data));
          loginAfter(data);
        }
      }

      asyncMethod();
    }
  }, [key]);

  const loginSuccess = async (result: any) => {
    const { access_token } = result;
    if (access_token) {
      let payload: any = { access_token };
      if (key) {
        payload['url'] = key;
      }

      const res = await axios.post('/login', payload);
      const { data } = res;

      if (data) {
        dispatch(login(data));
        loginAfter(data);
      }
    }
  };

  const loginAfter = (user: State) => {
    /**
     * 버그 터질 가능성 있음ㅠㅠ
     */
    if (!user.chatroom.name) {
      history.replace('/create-chat');
    } else if (user.questions.length == 0) {
      history.replace('/create-chat-complete')
    } else {
      history.replace('/chat')
    }
  }

  if (user.isLoggedIn) {
    loginAfter(user);
  }

  return (
    <>
      <styled.Top/>
      <styled.Image
        src={HomeImage}
        alt={"배경 이미지"}
      />

      <styled.Wrapper>
        <styled.Title
        >
          멀리 있는 가족과<br/>
          <b>가까워질 시간</b>
        </styled.Title>

        <styled.Content>
          서로의 꿈과 목표를 위해 몸은 잠시 떨어져 있지만,<br/>
          마음만은 언제나 함께인 우리 가족.<br/>
          <b>끼룩챗으로 서로의 일상과 관심사를 공유해보세요!</b>
        </styled.Content>

        {
          !isLoggedIn ? (
            <KakaoLogin
              onSuccess={(result) => loginSuccess(result)}
              onFailure={() => { }}
            />
          ) : <styled.Footer/>
        }
      </styled.Wrapper>
      <styled.Bottom/>
    </>
  );
};

export default Home;
