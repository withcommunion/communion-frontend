import type { GetServerSideProps } from 'next';
import { useEffect } from 'react';

import NavBar from '@/shared_components/navBar';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { increment } from '@/features/counter/counterSlice';
import {
  fetchPosts,
  selectAllPosts,
  selectPostByIdReselect,
} from '@/features/posts/postsSlice';
import { selectSelf, selectSelfStatus, fetchSelf } from '@/features/selfSlice';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
// Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const ReduxCheatSheet = ({ userJwt }: { userJwt: string }) => {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counter.value);
  const posts = useAppSelector((state) => selectAllPosts(state));
  const secondPost = useAppSelector((state) =>
    selectPostByIdReselect(state, '2')
  );

  const self = useAppSelector((state) => selectSelf(state));
  const selfStatus = useAppSelector((state) => selectSelfStatus(state));

  useEffect(() => {
    if (selfStatus === 'idle') {
      console.log('here', selfStatus);
      dispatch(fetchSelf(userJwt));
    }
  }, [userJwt, dispatch, self, selfStatus]);

  return (
    <>
      <NavBar signOut={() => undefined} active="send" />

      <div className="py-4 flex flex-col items-center ">
        <h1>Redux goodness</h1>
        <NavBar signOut={() => undefined} active="home" />

        <div>
          <h1>count: {count}</h1>
          <button onClick={() => dispatch(increment())}>Increase</button>
        </div>
        <div className="mt-10">
          <button className="outline" onClick={() => dispatch(fetchPosts())}>
            FetchPosts
          </button>
          {posts.length &&
            posts.map((post) => <div key={post.id}>{post.title}</div>)}
          {secondPost && (
            <div key={secondPost.id}>
              Second Post Selector: {secondPost.title}
            </div>
          )}
        </div>

        <div className="mt-10">
          {self && <div>First Name: {self.first_name}</div>}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const userJwt = await getUserJwtTokenOnServer(context);
    return {
      props: { userJwt },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    };
  }
};

export default ReduxCheatSheet;
