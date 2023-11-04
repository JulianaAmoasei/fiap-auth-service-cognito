import { object, string } from 'yup';

const adminSchema = object({
  email: string().email().required(),
});

export default function validateAdminData (email: string): boolean {
  try {
    
    adminSchema.validate({ email });
    return true;
  } catch (error) {
    return false;
  }
}
