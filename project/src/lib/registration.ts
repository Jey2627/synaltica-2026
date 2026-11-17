import { useCallback } from 'react';
import { supabase } from './supabase';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing chars

export function generateRegistrationId(): string {
  let id = '';
  for (let i = 0; i < 6; i += 1) {
    id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `SYN-${id}`;
}

export async function generateUniqueRegistrationId(attempts = 6): Promise<string> {
  for (let i = 0; i < attempts; i += 1) {
    const id = generateRegistrationId();
    // eslint-disable-next-line no-await-in-loop
    const { data } = await supabase
      .from('registrations')
      .select('registration_id')
      .eq('registration_id', id)
      .maybeSingle();
    if (!data) return id;
  }
  // Fallback: append extra digit
  return `${generateRegistrationId()}-${Math.floor(Math.random() * 9)}`;
}

export interface TeamMember {
  name: string;
  email: string;
  college: string;
  department: string;
  year: string;
}

export interface RegistrationPayload {
  registration_id: string;
  event_code: string;
  participant_name: string;
  college: string;
  department: string;
  year_of_study: string;
  email: string;
  mobile: string;
  team_name?: string;
  team_leader_name?: string;
  team_members?: TeamMember[];
}

export const isDuplicateError = (message: string): boolean =>
  /duplicate|unique|violates|23505/i.test(message);

export const useRegistration = () => {
  const submit = useCallback(async (payload: RegistrationPayload) => {
    const { data, error } = await supabase
      .from('registrations')
      .insert({
        registration_id: payload.registration_id,
        event_code: payload.event_code,
        participant_name: payload.participant_name,
        college: payload.college,
        department: payload.department,
        year_of_study: payload.year_of_study,
        email: payload.email.toLowerCase(),
        mobile: payload.mobile,
        team_name: payload.team_name || null,
        team_leader_name: payload.team_leader_name || null,
        team_members: payload.team_members ?? [],
      })
      .select('id, registration_id, event_code, participant_name, college, department, year_of_study, email, mobile, team_name, team_leader_name, team_members, created_at')
      .single();
    return { data, error };
  }, []);

  return { submit };
};
