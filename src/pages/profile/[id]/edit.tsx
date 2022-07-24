import {
  fetchUserInfo,
  SWR_USER_KEY,
  updateUserInfo,
  UserInfo,
} from '@entities/user';
import { IntroForm } from '@features/profile-edit';
import SkillsForm from '@features/profile-edit/ui/SkillsForm';
import { Tab } from '@headlessui/react';
import { DEFAULT_PUBLIC_KEY_STR } from '@shared/defaults';
import ArrowLeft from '@shared/icons/ArrowLeft.svg';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const ProfileEditPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  const profileId: string = (id as string) || DEFAULT_PUBLIC_KEY_STR;
  const profilePK = new PublicKey(profileId);

  const { data: userInfo, isLoading: isLoadingUserInfo } = useSWR(
    [SWR_USER_KEY, profileId],
    ([_, profileId]) => fetchUserInfo(profileId)
  );

  const { trigger: saveUserInfo } = useSWRMutation(
    [SWR_USER_KEY, profileId],
    ([_, profileId], { arg }: { arg: UserInfo }) =>
      updateUserInfo(profileId, arg)
  );

  const wallet = useWallet();

  const walletPublicKey = wallet.publicKey || PublicKey.default;
  const isOwner = walletPublicKey.equals(profilePK);

  return (
    <div className="pt-8">
      <div
        className="mb-6 flex cursor-pointer flex-row items-center text-sm text-light-300"
        onClick={router.back}
      >
        <ArrowLeft />
        Back to profile
      </div>
      <Tab.Group>
        <Tab.List className="mb-6 flex w-full flex-row space-x-6">
          <Tab
            className={({ selected }) =>
              `flex flex-1 border-b-2 ${
                selected ? 'border-accent' : 'border-dark-400 text-light-400'
              } font-bold outline-none`
            }
          >
            Intro
          </Tab>
          <Tab
            className={({ selected }) =>
              `flex flex-1 border-b-2 ${
                selected ? 'border-accent' : 'border-dark-400 text-light-400'
              } font-bold outline-none`
            }
          >
            Skills
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {isLoadingUserInfo ? null : (
              <IntroForm
                userInfo={userInfo!}
                onCancel={() => {
                  router.back();
                }}
                onSave={(info) => {
                  saveUserInfo(info);
                }}
              />
            )}
          </Tab.Panel>
          <Tab.Panel>
            <SkillsForm onCancel={() => {}} onSave={() => {}} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProfileEditPage;
