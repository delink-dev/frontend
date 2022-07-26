import { EMPTY_OBJ } from '@shared/defaults';
import { supabase } from '@shared/supabase';

export const SWR_USER_KEY = 'user';

export interface UserInfo {
  displayName?: string;
  shortName?: string;
}

export async function fetchUserInfo(id: string): Promise<UserInfo> {
  const { data } = await supabase
    .from('user')
    .select('display_name, short_name')
    .eq('id', id)
    .throwOnError()
    .maybeSingle();

  const { display_name = null, short_name = null } = data || EMPTY_OBJ;

  return { displayName: display_name, shortName: short_name };
}

export async function updateUserInfo(
  id: string,
  info: UserInfo
): Promise<UserInfo> {
  const res = await supabase
    .from('user')
    .update({ display_name: info.displayName, short_name: info.shortName })
    .eq('id', id)
    .throwOnError()
    .single();

  return res.data as UserInfo;
}