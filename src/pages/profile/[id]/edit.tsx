import { Avatar } from '@entities/profile';
import { DEFAULT_PUBLIC_KEY_STR } from '@shared/defaults';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import EditIcon from '@shared/icons/Edit.svg';
import { Tab } from '@headlessui/react';

const ProfileEditPage: NextPage = () => {
  const { query } = useRouter();

  const { id: profileId = DEFAULT_PUBLIC_KEY_STR } = query;
  const profilePK = new PublicKey(profileId);

  const wallet = useWallet();

  const walletPublicKey = wallet.publicKey || PublicKey.default;
  const isOwner = walletPublicKey.equals(profilePK);

  return (
    <Tab.Group>
      <Tab.List>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <div className="col-span-8 mt-8 mb-10 h-[348px] overflow-hidden rounded-xl bg-primary">
            <div className="h-1/2 bg-[#D3EDFF]">
              {isOwner && (
                <div className="flex w-full justify-end p-4">
                  <button className="rounded-full bg-light-500 p-2 text-accent shadow-md">
                    <EditIcon />
                  </button>
                </div>
              )}
            </div>
            <div className="px-6">
              <div className="-mt-16 mb-2">
                <Avatar pk={profilePK} />
              </div>
              <span>{profileId}</span>
            </div>
          </div>
          <div className="h-[200px] grid-cols-8 overflow-hidden rounded-xl bg-primary"></div>
        </Tab.Panel>
        <Tab.Panel></Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default ProfileEditPage;
