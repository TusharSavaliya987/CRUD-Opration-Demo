import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { Eye, EyeOff } from 'lucide-react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface UserFormProps {
  user?: User;
  onSubmit: (values: any) => Promise<void>;
  isSubmitting: boolean;
}

const UserForm = ({ user, onSubmit, isSubmitting }: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isEditMode = !!user;

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: user?.password || '',
      role: user?.role || 'User',
      dob: user?.dob ? format(new Date(user.dob), 'yyyy-MM-dd') : '',
      gender: user?.gender || 'Male',
      status: user?.status ?? true,
      profileImage: null as File | null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: isEditMode
        ? Yup.string()
        : Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
      role: Yup.string().required('Role is required'),
      dob: Yup.date().required('Date of birth is required'),
      gender: Yup.string().required('Gender is required'),
    }),
    onSubmit: async (values) => {
      // Convert File to base64 string for storage
      let profileImageString = user?.profileImage || null;
      
      if (values.profileImage) {
        const reader = new FileReader();
        profileImageString = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(values.profileImage);
        });
      }
      
      const userData = {
        ...values,
        id: user?.id || '',
        profileImage: profileImageString,
      };
      
      await onSubmit(userData);
    },
  });

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue('profileImage', file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // Set preview image from existing user
  useEffect(() => {
    if (user?.profileImage) {
      setPreviewImage(user.profileImage);
    }
  }, [user]);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 max-h-[600px] overflow-y-auto bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
      <div className="space-y-4">
        {/* Profile Image */}
        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Image</Label>
          <div className="flex items-center gap-4">
            {(previewImage || user?.profileImage) && (
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={previewImage || user?.profileImage || ''}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <Input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="flex-1 file:bg-gray-200 dark:file:bg-gray-700 file:text-black dark:file:text-white"
            />
          </div>
        </div>
        
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>
        
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>
        
        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Password {isEditMode && <span className="text-gray-500">(Leave blank to keep current)</span>}
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={isEditMode ? '••••••••' : 'Enter password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          )}
        </div>
        
        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            name="role"
            value={formik.values.role}
            onValueChange={(value) => formik.setFieldValue('role', value)}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800 text-black dark:text-white">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-sm text-red-500">{formik.errors.role}</p>
          )}
        </div>
        
        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            name="dob"
            type="date"
            value={formik.values.dob}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          {formik.touched.dob && formik.errors.dob && (
            <p className="text-sm text-red-500">{formik.errors.dob}</p>
          )}
        </div>
        
        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={formik.values.gender}
            onValueChange={(value) => formik.setFieldValue('gender', value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
          {formik.touched.gender && formik.errors.gender && (
            <p className="text-sm text-red-500">{formik.errors.gender}</p>
          )}
        </div>
        
        {/* Status */}
        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            checked={formik.values.status}
            onCheckedChange={(checked) => formik.setFieldValue('status', checked)}
          />
          <Label htmlFor="status">Active</Label>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !formik.isValid}
      >
        {isSubmitting
          ? 'Saving...'
          : isEditMode
          ? 'Update User'
          : 'Add User'}
      </Button>
    </form>
  );
};

export default UserForm;