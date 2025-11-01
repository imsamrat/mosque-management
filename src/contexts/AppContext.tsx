"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "bn";
type Theme = "light" | "dark";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Home Page
    title: "Qurbani Management System",
    subtitle: "Fair and transparent meat distribution for your village",
    donors: "Donors",
    members: "Members",
    distribution: "Distribution",
    slideshow: "Slideshow",
    donorsDesc: "Manage donor contributions",
    membersDesc: "Manage village members",
    distributionDesc: "Calculate & distribute shares",
    slideshowDesc: "View member shares",
    keyFeatures: "Key Features",
    donorManagement: "Donor Management",
    donorManagementDesc:
      "Add donors with beef, lungs, and bone quantities (in grams)",
    memberTracking: "Member Tracking",
    memberTrackingDesc:
      "Register members with family details and track distribution status",
    autoDistribution: "Auto Distribution",
    autoDistributionDesc: "Automatically calculate fair shares for all members",
    visualSlideshow: "Visual Slideshow",
    visualSlideshowDesc:
      "Display member shares in an easy-to-read slideshow format",
    getStarted: "Get Started",

    // Common
    name: "Name",
    fatherName: "Father's Name",
    houseName: "House Name",
    phone: "Phone",
    actions: "Actions",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    update: "Update",
    cancel: "Cancel",
    save: "Save",
    search: "Search",
    loading: "Loading...",
    success: "Success",
    error: "Error",

    // Donors Page
    donorManagementTitle: "Donor Management",
    donorManagementSubtitle: "Track all Qurbani donations",
    addDonor: "Add Donor",
    editDonor: "Edit Donor",
    addNewDonor: "Add New Donor",
    enterDonorDetails: "Enter donor details and meat quantities in grams (gm)",
    updateDonorDetails:
      "Update donor details and meat quantities in grams (gm)",
    totalDonors: "Total Donors",
    totalBeef: "Total Beef (gm)",
    totalLungs: "Total Lungs (gm)",
    totalBone: "Total Bone (gm)",
    beef: "Beef (gm)",
    lungs: "Lungs (gm)",
    bone: "Bone (gm)",
    donorAddedSuccess: "Donor added successfully",
    donorUpdatedSuccess: "Donor updated successfully",
    donorDeletedSuccess: "Donor deleted successfully",

    // Members Page
    memberManagementTitle: "Member Management",
    memberManagementSubtitle: "Manage all village members",
    addMember: "Add Member",
    editMember: "Edit Member",
    addNewMember: "Add New Member",
    enterMemberDetails: "Enter member details for distribution",
    updateMemberDetails: "Update member details",
    familyMembers: "Family Members",
    housePriority: "House Priority",
    beefShare: "Beef (gm)",
    lungsShare: "Lungs (gm)",
    boneShare: "Bone (gm)",
    status: "Status",
    pending: "Pending",
    completed: "Completed",
    allMembers: "All Members",
    completeList: "Complete list of all village members",
    searchPlaceholder: "Search by name, father's name, or house name...",
    memberAddedSuccess: "Member added successfully",
    memberUpdatedSuccess: "Member updated successfully",
    memberDeletedSuccess: "Member deleted successfully",

    // Distribution Page
    distributionManagementTitle: "Distribution Management",
    distributionManagementSubtitle: "Calculate and manage meat distribution",
    calculateDistribution: "Calculate Distribution",
    calculating: "Calculating...",
    totalCollection: "Total Collection",
    totalCollectionDesc: "Total meat collected from all donors",
    perPersonDistribution: "Per Person Distribution",
    perPersonDesc: "Fair share for each person",
    totalFamilyMembers: "Total Family Members",
    beefPerPerson: "Beef per Person",
    lungsPerPerson: "Lungs per Person",
    bonePerPerson: "Bone per Person",
    howToUse: "How to Use",

    // Slideshow Page
    slideshowTitle: "Distribution Slideshow",
    memberInfo: "Member Information",
    familySize: "Family Size",
    yourShare: "Your Share",
    pressKeys: "Press ← → to navigate",

    // Houses Page
    houseManagement: "House Management",
    manageSlideshowPriority: "Manage slideshow priority by house",
    howItWorks: "How It Works",
    houseInfo1:
      "Set priority for each house (lower number = shown first in slideshow)",
    houseInfo2:
      "All members from that house will automatically get the same priority",
    houseInfo3:
      "Example: House 10 priority = 1, House 8 priority = 2, House 5 priority = 3",
    houseInfo4: "No need to set priority for each member individually!",
    allHouses: "All Houses",
    clickToSetPriority:
      "Click 'Set Priority' to change house order in slideshow",
    noHousesYet: "No houses found. Add members first.",
    memberCount: "Member Count",
    currentPriority: "Current Priority",
    setPriority: "Set Priority",
    setHousePriority: "Set House Priority",
    allMembersWillUpdate: "All members from this house will be updated",
    lowerNumberHigherPriority: "Lower number = higher priority (shown first)",
    updateAllMembers: "Update All Members",
    updated: "Updated",
    trackDonations: "Track all Qurbani donations",
    allDonors: "All Donors",
    donorsList: "Complete list of all donations",
    noDonorsYet: "No donors yet. Click 'Add Donor' to get started.",
    deleteDonor: "Delete donor",
    updateDonor: "Update Donor",
    totalMeatCollected: "Total meat collected from all donors",
    perPersonDescription: "Fair share for each person",
    noMembersYet:
      "No members added yet. Please add members to calculate distribution.",
    step1:
      "Add all donors with their meat contributions (beef, lungs, bone in grams)",
    step2:
      "Add all village members with their family size (number of family members)",
    step3:
      "Click 'Calculate Distribution' to automatically divide meat equally based on total family members",
    step4:
      "Each member receives: (Per Person Share × Number of Family Members)",
    step5: "View member list to see individual family shares",
    step6: "Mark members as 'Completed' when they receive their share",
    step7: "Use the Slideshow page to display shares during distribution",
    totalMembers: "Total Members",

    // Settings
    language: "Language",
    theme: "Theme",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    english: "English",
    bengali: "বাংলা",
  },
  bn: {
    // Home Page
    title: "কুরবানী ব্যবস্থাপনা সিস্টেম",
    subtitle: "আপনার গ্রামের জন্য ন্যায্য এবং স্বচ্ছ মাংস বিতরণ",
    donors: "দাতা",
    members: "সদস্য",
    distribution: "বিতরণ",
    slideshow: "স্লাইডশো",
    donorsDesc: "দাতাদের অবদান পরিচালনা করুন",
    membersDesc: "গ্রামের সদস্যদের পরিচালনা করুন",
    distributionDesc: "হিস্যা গণনা এবং বিতরণ করুন",
    slideshowDesc: "সদস্যদের হিস্যা দেখুন",
    keyFeatures: "মূল বৈশিষ্ট্য",
    donorManagement: "দাতা ব্যবস্থাপনা",
    donorManagementDesc:
      "গরুর মাংস, ফুসফুস এবং হাড়ের পরিমাণ (গ্রামে) সহ দাতা যোগ করুন",
    memberTracking: "সদস্য ট্র্যাকিং",
    memberTrackingDesc:
      "পরিবারের বিবরণ সহ সদস্যদের নিবন্ধন করুন এবং বিতরণ স্থিতি ট্র্যাক করুন",
    autoDistribution: "স্বয়ংক্রিয় বিতরণ",
    autoDistributionDesc:
      "সমস্ত সদস্যদের জন্য স্বয়ংক্রিয়ভাবে ন্যায্য হিস্যা গণনা করুন",
    visualSlideshow: "ভিজ্যুয়াল স্লাইডশো",
    visualSlideshowDesc:
      "সহজে পড়া যায় এমন স্লাইডশো ফরম্যাটে সদস্যদের হিস্যা প্রদর্শন করুন",
    getStarted: "শুরু করুন",

    // Common
    name: "নাম",
    fatherName: "পিতার নাম",
    houseName: "বাড়ির নাম",
    phone: "ফোন",
    actions: "কার্যক্রম",
    add: "যোগ করুন",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    update: "আপডেট করুন",
    cancel: "বাতিল",
    save: "সংরক্ষণ",
    search: "খুঁজুন",
    loading: "লোড হচ্ছে...",
    success: "সফল",
    error: "ত্রুটি",

    // Donors Page
    donorManagementTitle: "দাতা ব্যবস্থাপনা",
    donorManagementSubtitle: "সমস্ত কুরবানী দান ট্র্যাক করুন",
    addDonor: "দাতা যোগ করুন",
    editDonor: "দাতা সম্পাদনা করুন",
    addNewDonor: "নতুন দাতা যোগ করুন",
    enterDonorDetails: "দাতার বিবরণ এবং মাংসের পরিমাণ গ্রামে (gm) লিখুন",
    updateDonorDetails: "দাতার বিবরণ এবং মাংসের পরিমাণ গ্রামে (gm) আপডেট করুন",
    totalDonors: "মোট দাতা",
    totalBeef: "মোট গরুর মাংস (gm)",
    totalLungs: "মোট ফুসফুস (gm)",
    totalBone: "মোট হাড় (gm)",
    beef: "গরুর মাংস (gm)",
    lungs: "ফুসফুস (gm)",
    bone: "হাড় (gm)",
    donorAddedSuccess: "দাতা সফলভাবে যোগ করা হয়েছে",
    donorUpdatedSuccess: "দাতা সফলভাবে আপডেট করা হয়েছে",
    donorDeletedSuccess: "দাতা সফলভাবে মুছে ফেলা হয়েছে",

    // Members Page
    memberManagementTitle: "সদস্য ব্যবস্থাপনা",
    memberManagementSubtitle: "সমস্ত গ্রামের সদস্যদের পরিচালনা করুন",
    addMember: "সদস্য যোগ করুন",
    editMember: "সদস্য সম্পাদনা করুন",
    addNewMember: "নতুন সদস্য যোগ করুন",
    enterMemberDetails: "বিতরণের জন্য সদস্যের বিবরণ লিখুন",
    updateMemberDetails: "সদস্যের বিবরণ আপডেট করুন",
    familyMembers: "পরিবারের সদস্য",
    housePriority: "বাড়ির অগ্রাধিকার",
    beefShare: "গরুর মাংস (gm)",
    lungsShare: "ফুসফুস (gm)",
    boneShare: "হাড় (gm)",
    status: "অবস্থা",
    pending: "বাকি আছে",
    completed: "সম্পন্ন",
    allMembers: "সমস্ত সদস্য",
    completeList: "সমস্ত গ্রামের সদস্যদের সম্পূর্ণ তালিকা",
    searchPlaceholder: "নাম, পিতার নাম, বা বাড়ির নাম দ্বারা খুঁজুন...",
    memberAddedSuccess: "সদস্য সফলভাবে যোগ করা হয়েছে",
    memberUpdatedSuccess: "সদস্য সফলভাবে আপডেট করা হয়েছে",
    memberDeletedSuccess: "সদস্য সফলভাবে মুছে ফেলা হয়েছে",

    // Distribution Page
    distributionManagementTitle: "বিতরণ ব্যবস্থাপনা",
    distributionManagementSubtitle: "মাংস বিতরণ গণনা এবং পরিচালনা করুন",
    calculateDistribution: "বিতরণ গণনা করুন",
    calculating: "গণনা করা হচ্ছে...",
    totalCollection: "মোট সংগ্রহ",
    totalCollectionDesc: "সমস্ত দাতাদের থেকে সংগৃহীত মোট মাংস",
    perPersonDistribution: "প্রতি ব্যক্তি বিতরণ",
    perPersonDesc: "প্রতিটি ব্যক্তির জন্য ন্যায্য হিস্যা",
    totalFamilyMembers: "মোট পরিবারের সদস্য",
    beefPerPerson: "প্রতি ব্যক্তি গরুর মাংস",
    lungsPerPerson: "প্রতি ব্যক্তি ফুসফুস",
    bonePerPerson: "প্রতি ব্যক্তি হাড়",
    howToUse: "কিভাবে ব্যবহার করবেন",

    // Slideshow Page
    slideshowTitle: "বিতরণ স্লাইডশো",
    memberInfo: "সদস্যের তথ্য",
    familySize: "পরিবারের আকার",
    yourShare: "আপনার হিস্যা",
    pressKeys: "নেভিগেট করতে ← → চাপুন",

    // Houses Page
    houseManagement: "বাড়ি ব্যবস্থাপনা",
    manageSlideshowPriority: "বাড়ি অনুসারে স্লাইডশো অগ্রাধিকার পরিচালনা করুন",
    howItWorks: "এটি কিভাবে কাজ করে",
    houseInfo1:
      "প্রতিটি বাড়ির জন্য অগ্রাধিকার সেট করুন (কম সংখ্যা = স্লাইডশোতে প্রথমে দেখানো হয়)",
    houseInfo2: "সেই বাড়ির সমস্ত সদস্য স্বয়ংক্রিয়ভাবে একই অগ্রাধিকার পাবে",
    houseInfo3:
      "উদাহরণ: বাড়ি ১০ অগ্রাধিকার = ১, বাড়ি ৮ অগ্রাধিকার = ২, বাড়ি ৫ অগ্রাধিকার = ৩",
    houseInfo4: "প্রতিটি সদস্যের জন্য পৃথকভাবে অগ্রাধিকার সেট করার দরকার নেই!",
    allHouses: "সমস্ত বাড়ি",
    clickToSetPriority:
      "স্লাইডশোতে বাড়ির ক্রম পরিবর্তন করতে 'অগ্রাধিকার সেট করুন' ক্লিক করুন",
    noHousesYet: "কোন বাড়ি পাওয়া যায়নি। প্রথমে সদস্য যোগ করুন।",
    memberCount: "সদস্য সংখ্যা",
    currentPriority: "বর্তমান অগ্রাধিকার",
    setPriority: "অগ্রাধিকার সেট করুন",
    setHousePriority: "বাড়ির অগ্রাধিকার সেট করুন",
    allMembersWillUpdate: "এই বাড়ির সমস্ত সদস্য আপডেট হবে",
    lowerNumberHigherPriority:
      "কম সংখ্যা = উচ্চ অগ্রাধিকার (প্রথমে দেখানো হয়)",
    updateAllMembers: "সমস্ত সদস্য আপডেট করুন",
    updated: "আপডেট হয়েছে",
    trackDonations: "সমস্ত কুরবানী দান ট্র্যাক করুন",
    allDonors: "সমস্ত দাতা",
    donorsList: "সমস্ত দানের সম্পূর্ণ তালিকা",
    noDonorsYet: "এখনও কোন দাতা নেই। শুরু করতে 'দাতা যোগ করুন' ক্লিক করুন।",
    deleteDonor: "দাতা মুছে ফেলুন",
    updateDonor: "দাতা আপডেট করুন",
    totalMeatCollected: "সমস্ত দাতাদের থেকে সংগৃহীত মোট মাংস",
    perPersonDescription: "প্রতিটি ব্যক্তির জন্য ন্যায্য হিস্যা",
    noMembersYet:
      "এখনও কোন সদস্য যোগ করা হয়নি। বিতরণ গণনা করতে দয়া করে সদস্য যোগ করুন।",
    step1:
      "সমস্ত দাতাদের তাদের মাংসের অবদান সহ যোগ করুন (গরুর মাংস, ফুসফুস, হাড় গ্রামে)",
    step2:
      "তাদের পরিবারের আকার সহ সমস্ত গ্রামের সদস্যদের যোগ করুন (পরিবারের সদস্য সংখ্যা)",
    step3:
      "মোট পরিবারের সদস্যদের ভিত্তিতে স্বয়ংক্রিয়ভাবে মাংস সমানভাবে ভাগ করতে 'বিতরণ গণনা করুন' ক্লিক করুন",
    step4: "প্রতিটি সদস্য পায়: (প্রতি ব্যক্তি হিস্যা × পরিবারের সদস্য সংখ্যা)",
    step5: "পৃথক পরিবারের হিস্যা দেখতে সদস্য তালিকা দেখুন",
    step6: "সদস্যরা তাদের হিস্যা পেলে 'সম্পন্ন' হিসাবে চিহ্নিত করুন",
    step7: "বিতরণের সময় হিস্যা প্রদর্শন করতে স্লাইডশো পৃষ্ঠা ব্যবহার করুন",
    totalMembers: "মোট সদস্য",

    // Settings
    language: "ভাষা",
    theme: "থিম",
    lightMode: "হালকা মোড",
    darkMode: "অন্ধকার মোড",
    english: "English",
    bengali: "বাংলা",
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("light");

  // Load from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    const savedTheme = localStorage.getItem("theme") as Theme;

    if (savedLanguage) setLanguageState(savedLanguage);
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
