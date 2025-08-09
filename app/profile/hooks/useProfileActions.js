"use client";

import { toast } from 'react-toastify';

export const useProfileActions = (user, setUser, editedUser, setEditedUser, setIsEditing) => {
  
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoUrl = e.target.result;
        const userId = localStorage.getItem("userId") || user.id;

        if (!userId) {
          toast.error("User ID not available. Cannot upload photo.");
          return;
        }

        try {
          const response = await fetch(`http://localhost:3001/users/profile/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              photo: photoUrl
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUser(prev => ({ ...prev, profilePhoto: photoUrl }));
              localStorage.setItem("userProfilePhoto", photoUrl);
              toast.success("Profile photo updated successfully!");
            } else {
              throw new Error(data.message || "Failed to update photo");
            }
          } else {
            throw new Error("Failed to update photo");
          }
        } catch (error) {
          console.error("Error updating photo:", error);
          toast.error("Failed to update photo. Please try again.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = async () => {
    const userId = localStorage.getItem("userId") || user.id;

    if (!userId) {
      toast.error("User ID not available. Cannot delete photo.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          photo: ""
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(prev => ({ ...prev, profilePhoto: "" }));
          localStorage.removeItem("userProfilePhoto");
          toast.success("Profile photo deleted successfully!");
        } else {
          throw new Error(data.message || "Failed to delete photo");
        }
      } else {
        throw new Error("Failed to delete photo");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo. Please try again.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId") || user.id;

    if (!userId) {
      toast.error("User ID not available. Cannot save profile.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedUser.name,
          photo: editedUser.profilePhoto
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("userName", editedUser.name);
          localStorage.setItem("userPhone", editedUser.phone);
          localStorage.setItem("userBio", editedUser.bio);

          setUser(editedUser);
          setIsEditing(false);
          toast.success("Profile updated successfully!");
        } else {
          throw new Error(data.message || "Failed to update profile");
        }
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteProfile = async () => {
    const userId = localStorage.getItem("userId") || user.id;

    if (!userId) {
      toast.error("User ID not available. Cannot delete profile.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/profile/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.clear();
          toast.success("Profile deleted successfully!");
          setTimeout(() => {
            window.location.href = "/signin";
          }, 2000);
        } else {
          throw new Error(data.message || "Failed to delete profile");
        }
      } else {
        throw new Error("Failed to delete profile");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete profile. Please try again.");
    }
  };

  return {
    handlePhotoUpload,
    handleDeletePhoto,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleDeleteProfile
  };
};