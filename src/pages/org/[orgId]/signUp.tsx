import Footer from '@/shared_components/footer/footer';
import {
  Welcome,
  SignUpForm,
  LinkToSignIn,
} from '@/pages_components/org/[orgId]/signUpComponents';

const signUp = () => {
  return (
    <div className="bg-white min-h-100vh ">
      <div className="container w-full px-6 my-0 mx-auto md:max-w-50vw overflow-hidden">
        <Welcome />
        <SignUpForm />
        <LinkToSignIn />
        <Footer />
      </div>
    </div>
  );
};

export default signUp;
