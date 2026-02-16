import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'de' | 'fr' | 'es' | 'it';

export const languages: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
];

type Translations = {
  // Navigation
  discover: string;
  resources: string;
  chats: string;
  profile: string;
  settings: string;
  logout: string;
  preview: string;
  requests: string;
  myProfile: string;
  
  // Common
  filters: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  back: string;
  next: string;
  submit: string;
  loading: string;
  
  // Discover
  potentialCoParents: string;
  noMatches: string;
  adjustFilters: string;
  
  // Profile
  manageAccount: string;
  editProfile: string;
  profileComplete: string;
  viewsThisWeek: string;
  accountSettings: string;
  appMode: string;
  seekerLabel: string;
  candidateLabel: string;
  shortlist: string;
  savedProfiles: string;
  safetyPrivacy: string;
  privacySettings: string;
  plansSubscription: string;
  manageSubscription: string;
  notifications: string;
  notificationPreferences: string;
  accountSecurity: string;
  securitySettings: string;
  appSettings: string;
  
  // Settings
  preferences: string;
  language: string;
  darkMode: string;
  darkModeDesc: string;
  soundEffects: string;
  soundEffectsDesc: string;
  communication: string;
  pushNotifications: string;
  pushNotificationsDesc: string;
  emailPreferences: string;
  emailPreferencesDesc: string;
  support: string;
  helpCenter: string;
  helpCenterDesc: string;
  termsOfService: string;
  termsOfServiceDesc: string;
  privacyPolicy: string;
  privacyPolicyDesc: string;
  aboutApp: string;
  
  // Safety & Privacy
  profileVisibility: string;
  profileVisibilityDesc: string;
  showOnlineStatus: string;
  showOnlineStatusDesc: string;
  showLocation: string;
  showLocationDesc: string;
  showLastActive: string;
  showLastActiveDesc: string;
  blockedUsers: string;
  blockedUsersDesc: string;
  reportHistory: string;
  reportHistoryDesc: string;
  safetyPriority: string;
  safetyPriorityDesc: string;
  
  // Notifications
  newMessages: string;
  newMessagesDesc: string;
  newMatches: string;
  newMatchesDesc: string;
  profileViews: string;
  profileViewsDesc: string;
  reminders: string;
  remindersDesc: string;
  weeklyDigest: string;
  weeklyDigestDesc: string;
  marketingEmails: string;
  marketingEmailsDesc: string;
  
  // Account Security
  changePassword: string;
  changePasswordDesc: string;
  changeEmail: string;
  changeEmailDesc: string;
  twoFactorAuth: string;
  twoFactorAuthDesc: string;
  loginHistory: string;
  loginHistoryDesc: string;
  activeSessions: string;
  activeSessionsDesc: string;
  dangerZone: string;
  deleteAccount: string;
  deleteAccountDesc: string;
  newPassword: string;
  confirmPassword: string;
  updatePassword: string;
  newEmail: string;
  updateEmail: string;
  lastSignInLabel: string;
  thisDevice: string;
  signOutHere: string;
  deleteAccountConfirm: string;
  deleteAccountSuccess: string;
  twoFactorComingSoon: string;

  // Resources
  learnAboutCoParenting: string;
  everythingYouNeed: string;
  legalFramework: string;
  legalFrameworkDesc: string;
  agreementTemplates: string;
  agreementTemplatesDesc: string;
  communityStories: string;
  communityStoriesDesc: string;
  relationshipGuidance: string;
  relationshipGuidanceDesc: string;
  planningTools: string;
  planningToolsDesc: string;
  readingList: string;
  readingListDesc: string;
  needMoreGuidance: string;
  findProfessional: string;
  
  // Conversations
  conversations: string;
  ongoingChats: string;
  typeMessage: string;
  viewProfile: string;
  topics: string;
  topicsCovered: string;
  markTopicsAsCovered: string;
  startConversation: string;
  noMessagesYet: string;
  selectConversation: string;
  topicParenting: string;
  topicConception: string;
  topicCustody: string;
  topicLiving: string;
  topicLegal: string;
  topicFinancial: string;
  
  // Profile Edit
  backToProfile: string;
  updatePersonalInfo: string;
  complete: string;
  completeProfileForBetterMatches: string;
  bio: string;
  tellPeopleAboutYourself: string;
  aboutYou: string;
  work: string;
  education: string;
  location: string;
  hometown: string;
  spokenLanguages: string;
  interests: string;
  causesAndCommunities: string;
  coreValues: string;
  moreAboutYou: string;
  height: string;
  weight: string;
  exercise: string;
  drinking: string;
  smoking: string;
  cannabis: string;
  drugs: string;
  diet: string;
  vaccinated: string;
  bloodType: string;
  eyeColour: string;
  hairColour: string;
  ethnicity: string;
  sexuality: string;
  relationshipStatus: string;
  householdSituation: string;
  familySituation: string;
  children: string;
  pets: string;
  religion: string;
  politics: string;
  starSign: string;
  coParentingPreferences: string;
  lookingFor: string;
  openTo: string;
  custodyPreference: string;
  custodyModel: string;
  conceptionMethod: string;
  openToRelocation: string;
  parentingPhilosophy: string;
  financialSituation: string;
  lifestyleRhythm: string;
  addLanguagesYouSpeak: string;
  addYourInterests: string;
  addCausesYouCareAbout: string;
  addValuesYouCareAbout: string;
  describeYourApproach: string;
  describeFinancialSituation: string;
  describeDailyRhythm: string;
  yes: string;
  no: string;
  child: string;
  selectUpTo: string;
  selected: string;
  duringSchool: string;
  duringVacation: string;
  furtherInfo: string;
  searchForCity: string;
  searchForHometown: string;
  howTallAreYou: string;
  whatsYourWeight: string;
  howOftenWorkout: string;
  doYouDrink: string;
  doYouSmoke: string;
  doYouUseCannabis: string;
  doYouUseDrugs: string;
  whatsYourDiet: string;
  vaccinationStatus: string;
  whatsYourBloodType: string;
  whatColourEyes: string;
  whatColourHair: string;
  ethnicBackground: string;
  sexualOrientation: string;
  currentStatus: string;
  livingArrangement: string;
  relationshipWithFamily: string;
  addChildrenDetails: string;
  doYouHavePets: string;
  religiousBeliefs: string;
  politicalViews: string;
  zodiacSign: string;
  whatLanguagesDoYouKnow: string;
  languagesHelperText: string;
  selectUpToFive: string;
  selectUpToThree: string;
  howMuchTimeWithChild: string;
  preferredInvolvement: string;
  approachesOpenTo: string;
  custodyArrangementPrefs: string;
    describeParentingPhilosophy: string;
    describeFinancialApproach: string;
    describeRoutine: string;
    
    // Candidate Detail & Card
    candidateNotFound: string;
    goBack: string;
    backToDiscover: string;
    match: string;
    message: string;
    aboutMe: string;
    about: string;
    lifestyle: string;
    custodyPreferenceLabel: string;
    conceptionMethodLabel: string;
    openToRelocationLabel: string;
    familySupport: string;
    active: string;
    sometimes: string;
    rarely: string;
    never: string;
    socially: string;
    regularly: string;
    nonSmoker: string;
    smoker: string;
    formerSmoker: string;
    worksOutRegularly: string;
    severalTimesWeek: string;
    onceAWeek: string;
    occasionally: string;
    almostNever: string;
    doesntDrink: string;
    onSpecialOccasions: string;
    whenWithFriends: string;
    mostWeekends: string;
    naturalConception: string;
    assistedReproduction: string;
    openToBoth: string;
    
    // Conversation Detail & Flow
    conversationNotFound: string;
    stepsCompleted: string;
    conversationResponses: string;
    waitingForResponse: string;
    notAFit: string;
    interested: string;
    bothInterested: string;
    arrangeAMeeting: string;
    stepOf: string;
    continueBtn: string;
    completeBtn: string;
    conversationComplete: string;
    responsesHaveBeenSaved: string;
    willBeNotified: string;
    yourResponses: string;
    notAnswered: string;
    viewAllConversations: string;
    
    // Preview
    profilePreview: string;
    seeHowSeekersView: string;
    cardView: string;
    detailView: string;
    view: string;
    vision: string;
    completeProfileToImprove: string;
    
    // Not Found
    pageNotFound: string;
    oopsPageNotFound: string;
    returnToHome: string;
    
    // Desktop Footer
    product: string;
    company: string;
    legal: string;
    howItWorks: string;
    pricing: string;
    aboutUs: string;
    blog: string;
    careers: string;
    contact: string;
    cookiePolicy: string;
    allRightsReserved: string;
    findYourCoParent: string;
    
    // Children Manager
    noChildrenAdded: string;
    addChild: string;
    addAnotherChild: string;
    gender: string;
    boy: string;
    girl: string;
    other: string;
    birthdate: string;
    custody: string;
    yearsOld: string;
    
    // City Search
    searching: string;
    noCitiesFound: string;
    findYourCity: string;
    
    // Resource Detail
    backToResources: string;
    sectionsLabel: string;
    resourceNotFound: string;
    connectWithProfessionals: string;
    minRead: string;
    
    // Resource Content - Legal Framework
    legalFrameworkSubtitle: string;
    legalSection1Title: string;
    legalSection1Content: string;
    legalSection2Title: string;
    legalSection2Content: string;
    legalSection3Title: string;
    legalSection3Content: string;
    legalSection4Title: string;
    legalSection4Content: string;
    
    // Resource Content - Agreement Templates
    agreementTemplatesSubtitle: string;
    agreementSection1Title: string;
    agreementSection1Content: string;
    agreementSection2Title: string;
    agreementSection2Content: string;
    agreementSection3Title: string;
    agreementSection3Content: string;
    
    // Resource Content - Community Stories
    communityStoriesSubtitle: string;
    communitySection1Title: string;
    communitySection1Content: string;
    communitySection2Title: string;
    communitySection2Content: string;
    communitySection3Title: string;
    communitySection3Content: string;
    
    // Resource Content - Relationship Guidance
    relationshipGuidanceSubtitle: string;
    relationshipSection1Title: string;
    relationshipSection1Content: string;
    relationshipSection2Title: string;
    relationshipSection2Content: string;
    relationshipSection3Title: string;
    relationshipSection3Content: string;
    
    // Resource Content - Planning Tools
    planningToolsSubtitle: string;
    planningSection1Title: string;
    planningSection1Content: string;
    planningSection2Title: string;
    planningSection2Content: string;
    planningSection3Title: string;
    planningSection3Content: string;
    
    // Resource Content - Reading List
    readingListSubtitle: string;
    readingSection1Title: string;
    readingSection1Content: string;
    readingSection2Title: string;
    readingSection2Content: string;
    readingSection3Title: string;
    readingSection3Content: string;
};

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    discover: 'Discover',
    resources: 'Resources',
    chats: 'Chats',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Log out',
    preview: 'Preview',
    requests: 'Requests',
    myProfile: 'My Profile',
    
    // Common
    filters: 'Filters',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    loading: 'Loading...',
    
    // Discover
    potentialCoParents: 'potential co-parents match your criteria',
    noMatches: 'No candidates match your filters.',
    adjustFilters: 'Adjust Filters',
    
    // Profile
    manageAccount: 'Manage your account',
    editProfile: 'Edit Profile',
    profileComplete: 'Profile Complete',
    viewsThisWeek: 'Views this week',
    accountSettings: 'Account Settings',
    appMode: 'I\'m using Kindly as',
    seekerLabel: 'Seeker',
    candidateLabel: 'Candidate',
    shortlist: 'Shortlist',
    savedProfiles: 'View your saved profiles',
    safetyPrivacy: 'Safety & Privacy',
    privacySettings: 'Manage your privacy settings',
    plansSubscription: 'Plans & Subscription',
    manageSubscription: 'Manage your subscription',
    notifications: 'Notifications',
    notificationPreferences: 'Manage notification preferences',
    accountSecurity: 'Account Security',
    securitySettings: 'Password and security settings',
    appSettings: 'App settings and preferences',
    
    // Settings
    preferences: 'Preferences',
    language: 'Language',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Switch between light and dark theme',
    soundEffects: 'Sound Effects',
    soundEffectsDesc: 'Enable in-app sounds',
    communication: 'Communication',
    pushNotifications: 'Push Notifications',
    pushNotificationsDesc: 'Manage push notification settings',
    emailPreferences: 'Email Preferences',
    emailPreferencesDesc: 'Newsletter and email notifications',
    support: 'Support',
    helpCenter: 'Help Center',
    helpCenterDesc: 'FAQs and support articles',
    termsOfService: 'Terms of Service',
    termsOfServiceDesc: 'Read our terms and conditions',
    privacyPolicy: 'Privacy Policy',
    privacyPolicyDesc: 'How we handle your data',
    aboutApp: 'About Kindly',
    
    // Safety & Privacy
    profileVisibility: 'Profile Visibility',
    profileVisibilityDesc: 'Make your profile visible to others',
    showOnlineStatus: 'Show Online Status',
    showOnlineStatusDesc: "Let others see when you're online",
    showLocation: 'Show Location',
    showLocationDesc: 'Display your city on your profile',
    showLastActive: 'Show Last Active',
    showLastActiveDesc: 'Show when you were last active',
    blockedUsers: 'Blocked Users',
    blockedUsersDesc: 'Manage blocked profiles',
    reportHistory: 'Report History',
    reportHistoryDesc: 'View your submitted reports',
    safetyPriority: 'Your safety is our priority',
    safetyPriorityDesc: 'All conversations are monitored for inappropriate content. Report any concerns and our team will review within 24 hours.',
    
    // Notifications
    newMessages: 'New Messages',
    newMessagesDesc: 'Get notified when you receive a message',
    newMatches: 'New Matches',
    newMatchesDesc: 'Someone added you to their shortlist',
    profileViews: 'Profile Views',
    profileViewsDesc: 'Someone viewed your profile',
    reminders: 'Reminders',
    remindersDesc: 'Activity reminders and tips',
    weeklyDigest: 'Weekly Digest',
    weeklyDigestDesc: 'Summary of your weekly activity',
    marketingEmails: 'Marketing Emails',
    marketingEmailsDesc: 'News, tips, and special offers',
    
    // Account Security
    changePassword: 'Change Password',
    changePasswordDesc: 'Update your account password',
    changeEmail: 'Change Email',
    changeEmailDesc: 'Update your email address',
    twoFactorAuth: 'Two-Factor Authentication',
    twoFactorAuthDesc: 'Add an extra layer of security',
    loginHistory: 'Login History',
    loginHistoryDesc: 'View your recent login activity',
    activeSessions: 'Active Sessions',
    activeSessionsDesc: 'Manage devices logged into your account',
    dangerZone: 'Danger Zone',
    deleteAccount: 'Delete Account',
    deleteAccountDesc: 'Permanently delete your account and data',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    updatePassword: 'Update password',
    newEmail: 'New email',
    updateEmail: 'Update email',
    lastSignInLabel: 'Last sign-in',
    thisDevice: 'This device',
    signOutHere: 'Sign out',
    deleteAccountConfirm: 'This will permanently delete your account and data. You will be signed out. This cannot be undone.',
    deleteAccountSuccess: 'Your account has been deleted.',
    twoFactorComingSoon: 'Coming soon',

    // Resources
    learnAboutCoParenting: 'Learn about co-parenting',
    everythingYouNeed: 'Everything you need to know about co-parenting',
    legalFramework: 'Legal Framework',
    legalFrameworkDesc: 'Understanding Swiss co-parenting laws and custody arrangements',
    agreementTemplates: 'Agreement Templates',
    agreementTemplatesDesc: 'Sample co-parenting agreements and contracts',
    communityStories: 'Community Stories',
    communityStoriesDesc: 'Real experiences from successful co-parenting partnerships',
    relationshipGuidance: 'Relationship Guidance',
    relationshipGuidanceDesc: 'Building a healthy co-parenting partnership',
    planningTools: 'Planning Tools',
    planningToolsDesc: 'Scheduling, budgeting, and logistics checklists',
    readingList: 'Reading List',
    readingListDesc: 'Recommended books on modern family structures',
    needMoreGuidance: 'Need more guidance?',
    findProfessional: 'Find a Professional',
    
    // Conversations
    conversations: 'Conversations',
    ongoingChats: 'ongoing chats',
    typeMessage: 'Type a message...',
    viewProfile: 'View Profile',
    topics: 'Topics',
    topicsCovered: 'topics covered',
    markTopicsAsCovered: 'Click on topics you\'ve discussed to mark them as covered:',
    startConversation: 'Start the conversation by sending a message',
    noMessagesYet: 'No messages yet',
    selectConversation: 'Select a conversation to start chatting',
    topicParenting: 'Parenting Philosophy',
    topicConception: 'Conception Method',
    topicCustody: 'Weekly Rhythm & Custody',
    topicLiving: 'Living Situation',
    topicLegal: 'Legal Setup',
    topicFinancial: 'Financial Expectations',

    // Profile Edit
    backToProfile: 'Back to Profile',
    updatePersonalInfo: 'Update your personal information and preferences',
    complete: 'Complete',
    completeProfileForBetterMatches: 'Complete your profile for better matches',
    bio: 'Bio',
    tellPeopleAboutYourself: 'Tell people about yourself...',
    aboutYou: 'About you',
    work: 'Work',
    education: 'Education',
    location: 'Location',
    hometown: 'Hometown',
    spokenLanguages: 'Languages',
    interests: 'Interests',
    causesAndCommunities: 'Causes & Communities',
    coreValues: 'Core Values',
    moreAboutYou: 'More about you',
    height: 'Height',
    weight: 'Weight',
    exercise: 'Exercise',
    drinking: 'Drinking',
    smoking: 'Smoking',
    cannabis: 'Cannabis',
    drugs: 'Drugs',
    diet: 'Diet',
    vaccinated: 'Vaccinated',
    bloodType: 'Blood type',
    eyeColour: 'Eye colour',
    hairColour: 'Hair colour',
    ethnicity: 'Ethnicity',
    sexuality: 'Sexuality',
    relationshipStatus: 'Relationship status',
    householdSituation: 'Household situation',
    familySituation: 'Family situation',
    children: 'Children',
    pets: 'Pets',
    religion: 'Religion',
    politics: 'Politics',
    starSign: 'Star sign',
    coParentingPreferences: 'Co-parenting preferences',
    lookingFor: 'Looking for',
    openTo: 'Open to',
    custodyPreference: 'Custody preference',
    custodyModel: 'Custody model',
    conceptionMethod: 'Conception method',
    openToRelocation: 'Open to relocation',
    parentingPhilosophy: 'Parenting philosophy',
    financialSituation: 'Financial situation',
    lifestyleRhythm: 'Lifestyle rhythm',
    addLanguagesYouSpeak: 'Add languages you speak',
    addYourInterests: 'Add your interests',
    addCausesYouCareAbout: 'Add causes you care about',
    addValuesYouCareAbout: 'Add values you care about',
    describeYourApproach: 'Describe your approach to parenting...',
    describeFinancialSituation: 'Describe your financial situation...',
    describeDailyRhythm: 'Describe your daily rhythm and lifestyle...',
    yes: 'Yes',
    no: 'No',
    child: 'child',
    selectUpTo: 'Select up to',
    selected: 'selected',
    duringSchool: 'During school',
    duringVacation: 'During vacation',
    furtherInfo: 'Further information',
    searchForCity: 'Search for your city...',
    searchForHometown: 'Search for your hometown...',
    howTallAreYou: 'How tall are you?',
    whatsYourWeight: "What's your weight?",
    howOftenWorkout: 'How often do you work out?',
    doYouDrink: 'Do you drink alcohol?',
    doYouSmoke: 'Do you smoke?',
    doYouUseCannabis: 'Do you use cannabis?',
    doYouUseDrugs: 'Do you use recreational drugs?',
    whatsYourDiet: "What's your diet?",
    vaccinationStatus: "What's your vaccination status?",
    whatsYourBloodType: "What's your blood type?",
    whatColourEyes: 'What colour are your eyes?',
    whatColourHair: 'What colour is your hair?',
    ethnicBackground: "What's your ethnic background?",
    sexualOrientation: "What's your sexual orientation?",
    currentStatus: "What's your current status?",
    livingArrangement: "What's your current living arrangement?",
    relationshipWithFamily: 'How is your relationship with parents and siblings?',
    addChildrenDetails: 'Add your children with details',
    doYouHavePets: 'Do you have any pets?',
    religiousBeliefs: 'What are your religious beliefs?',
    politicalViews: 'What are your political views?',
    zodiacSign: "What's your zodiac sign?",
    whatLanguagesDoYouKnow: 'What languages do you know?',
    languagesHelperText: "We'll show these on your profile and use them to connect you with great matches who know your languages.",
    selectUpToFive: 'Select up to 5',
    selectUpToThree: 'Select up to 3',
    howMuchTimeWithChild: 'How much time would you like with your child?',
    preferredInvolvement: 'Preferred involvement',
    approachesOpenTo: 'What approaches are you open to?',
    custodyArrangementPrefs: 'Define your custody arrangement preferences',
    describeParentingPhilosophy: 'Tell us about your parenting philosophy, values, and approach to raising children...',
    describeFinancialApproach: 'Describe your financial situation and approach to sharing costs...',
    describeRoutine: 'Describe your typical day, routine, and lifestyle rhythm...',
    
    // Candidate Detail & Card
    candidateNotFound: 'Candidate not found',
    goBack: 'Go Back',
    backToDiscover: 'Back to Discover',
    match: 'match',
    message: 'Message',
    aboutMe: 'About Me',
    about: 'About',
    lifestyle: 'Lifestyle',
    custodyPreferenceLabel: 'Custody Preference',
    conceptionMethodLabel: 'Conception Method',
    openToRelocationLabel: 'Open to Relocation',
    familySupport: 'Family Support',
    active: 'Active',
    sometimes: 'Sometimes',
    rarely: 'Rarely',
    never: 'Never',
    socially: 'Socially',
    regularly: 'Regularly',
    nonSmoker: 'Non-smoker',
    smoker: 'Smoker',
    formerSmoker: 'Former',
    worksOutRegularly: 'Works out regularly',
    severalTimesWeek: 'Several times per week',
    onceAWeek: 'Once a week',
    occasionally: 'Occasionally',
    almostNever: 'Almost never',
    doesntDrink: "Doesn't drink alcohol",
    onSpecialOccasions: 'On special occasions',
    whenWithFriends: 'When with friends',
    mostWeekends: 'Most weekends',
    naturalConception: 'Natural conception',
    assistedReproduction: 'Assisted reproduction (IVF, IUI, etc.)',
    openToBoth: 'Open to both',
    
    // Conversation Detail & Flow
    conversationNotFound: 'Conversation not found',
    stepsCompleted: 'steps completed',
    conversationResponses: 'Conversation Responses',
    waitingForResponse: 'Waiting for next response...',
    notAFit: 'Not a fit',
    interested: 'Interested',
    bothInterested: 'Both parties are interested!',
    arrangeAMeeting: 'Time to arrange a meeting and continue the conversation.',
    stepOf: 'Step',
    continueBtn: 'Continue',
    completeBtn: 'Complete',
    conversationComplete: 'Conversation Complete!',
    responsesHaveBeenSaved: 'Your responses have been saved.',
    willBeNotified: 'will be notified.',
    yourResponses: 'Your Responses',
    notAnswered: 'Not answered',
    viewAllConversations: 'View All Conversations',
    
    // Preview
    profilePreview: 'Profile Preview',
    seeHowSeekersView: 'See how seekers view your profile',
    cardView: 'Card View',
    detailView: 'Detail View',
    view: 'View',
    vision: 'Vision',
    completeProfileToImprove: 'Complete your profile to improve how you appear to seekers',
    
    // Not Found
    pageNotFound: '404',
    oopsPageNotFound: 'Oops! Page not found',
    returnToHome: 'Return to Home',
    
    // Desktop Footer
    product: 'Product',
    company: 'Company',
    legal: 'Legal',
    howItWorks: 'How it Works',
    pricing: 'Pricing',
    aboutUs: 'About Us',
    blog: 'Blog',
    careers: 'Careers',
    contact: 'Contact',
    cookiePolicy: 'Cookie Policy',
    allRightsReserved: 'All rights reserved.',
    findYourCoParent: 'Find your perfect co-parenting partner with Kindly.',
    
    // Children Manager
    noChildrenAdded: 'No children added yet',
    addChild: 'Add child',
    addAnotherChild: 'Add another child',
    gender: 'Gender',
    boy: 'Boy',
    girl: 'Girl',
    other: 'Other',
    birthdate: 'Birthdate',
    custody: 'Custody',
    yearsOld: 'years old',
    
    // City Search
    searching: 'Searching...',
    noCitiesFound: 'No cities found',
    findYourCity: 'Find your current city',
    
    // Resource Detail
    backToResources: 'Back to Resources',
    sectionsLabel: 'sections',
    resourceNotFound: 'Resource not found',
    connectWithProfessionals: 'Connect with verified professionals who can help with your co-parenting journey.',
    minRead: 'min read',
    
    // Resource Content - Legal Framework
    legalFrameworkSubtitle: 'Understanding Swiss co-parenting laws and custody arrangements',
    legalSection1Title: 'Overview of Swiss Family Law',
    legalSection1Content: 'Swiss family law provides a comprehensive framework for co-parenting arrangements. The Civil Code (Zivilgesetzbuch) governs matters related to parental authority, custody, and child support. Recent reforms have emphasized the importance of both parents maintaining active roles in their children\'s lives.',
    legalSection2Title: 'Joint Custody Arrangements',
    legalSection2Content: 'Since 2014, joint custody has been the default arrangement in Switzerland, unless it is contrary to the child\'s best interests. This means both parents share decision-making responsibilities for major aspects of the child\'s life, including education, healthcare, and religious upbringing.',
    legalSection3Title: 'Establishing Paternity',
    legalSection3Content: 'For unmarried parents, paternity must be legally established either through acknowledgment by the father or through court proceedings. This step is crucial for establishing the legal rights and responsibilities of both parents.',
    legalSection4Title: 'Financial Responsibilities',
    legalSection4Content: 'Both parents are legally required to contribute to the financial support of their child. Child support calculations consider the income of both parents, the child\'s needs, and the amount of time spent with each parent.',
    
    // Resource Content - Agreement Templates
    agreementTemplatesSubtitle: 'Sample co-parenting agreements and contracts',
    agreementSection1Title: 'Why Written Agreements Matter',
    agreementSection1Content: 'A written co-parenting agreement helps prevent misunderstandings and provides a clear reference for both parties. While verbal agreements can work, having documentation protects everyone\'s interests.',
    agreementSection2Title: 'Key Components to Include',
    agreementSection2Content: 'Your agreement should cover: custody schedule, decision-making responsibilities, financial contributions, communication protocols, dispute resolution methods, and provisions for future modifications.',
    agreementSection3Title: 'Legal Review',
    agreementSection3Content: 'We strongly recommend having any co-parenting agreement reviewed by a family law attorney before signing. This ensures the agreement is enforceable and protects both parties\' rights.',
    
    // Resource Content - Community Stories
    communityStoriesSubtitle: 'Real experiences from successful co-parenting partnerships',
    communitySection1Title: 'Maria & Thomas - Zurich',
    communitySection1Content: '"We met through Kindly two years ago and now have a beautiful daughter together. The key to our success has been clear communication and mutual respect. We scheduled regular check-ins to discuss parenting decisions and always put our daughter\'s needs first."',
    communitySection2Title: 'Sophie & Jan - Basel',
    communitySection2Content: '"As a single woman in my late 30s, I thought my dream of becoming a mother was fading. Finding Jan through this platform changed everything. We took our time getting to know each other, met with a counselor together, and created a detailed parenting plan before proceeding."',
    communitySection3Title: 'Tips from Our Community',
    communitySection3Content: 'Common advice from successful co-parents: take time to really get to know your potential co-parent, be honest about your expectations, seek professional guidance, and remember that flexibility and patience are essential.',
    
    // Resource Content - Relationship Guidance
    relationshipGuidanceSubtitle: 'Building a healthy co-parenting partnership',
    relationshipSection1Title: 'Communication is Key',
    relationshipSection1Content: 'Successful co-parenting relationships are built on open, honest communication. Establish preferred communication methods early on and commit to regular check-ins about your child\'s wellbeing and development.',
    relationshipSection2Title: 'Setting Boundaries',
    relationshipSection2Content: 'Clear boundaries help maintain a healthy co-parenting relationship. Discuss and agree on expectations around personal space, romantic relationships, parenting decisions, and involvement of extended family.',
    relationshipSection3Title: 'Conflict Resolution',
    relationshipSection3Content: 'Disagreements are normal in any relationship. Develop strategies for handling conflicts constructively, such as taking time to cool down, using "I" statements, and focusing on solutions rather than blame.',
    
    // Resource Content - Planning Tools
    planningToolsSubtitle: 'Scheduling, budgeting, and logistics checklists',
    planningSection1Title: 'Custody Schedule Planning',
    planningSection1Content: 'Consider various schedule options: alternating weeks, 2-2-3 rotation, or other arrangements that work for your situation. Use shared calendars to track custody time, appointments, and activities.',
    planningSection2Title: 'Financial Planning Checklist',
    planningSection2Content: 'Key financial considerations: medical expenses and insurance, childcare costs, education funds, clothing and essentials, extracurricular activities, and emergency funds.',
    planningSection3Title: 'Logistics Coordination',
    planningSection3Content: 'Practical matters to address: exchange locations and times, transportation responsibilities, communication about daily routines, handling holidays and special occasions, and emergency contact protocols.',
    
    // Resource Content - Reading List
    readingListSubtitle: 'Recommended books on modern family structures',
    readingSection1Title: 'Essential Reading',
    readingSection1Content: '"Co-Parenting 101" by Deesha Philyaw - A practical guide to navigating shared parenting. "The Co-Parents\' Handbook" by Karen Bonnell - Strategies for effective collaboration. "Modern Families" by Joshua Gamson - Exploring diverse family structures.',
    readingSection2Title: 'For Children',
    readingSection2Content: 'Age-appropriate books to help children understand their family structure: "Two Homes" by Claire Masurel, "Mom\'s House, Dad\'s House for Kids" by Isolina Ricci, and "Standing on My Own Two Feet" by Tamara Schmitz.',
    readingSection3Title: 'Legal & Financial Resources',
    readingSection3Content: '"The Complete Guide to Custody Agreements" - Understanding your legal options. "Money and Family" by Liz Frazier - Financial planning for modern families.',
  },
  de: {
    // Navigation
    discover: 'Entdecken',
    resources: 'Ressourcen',
    chats: 'Chats',
    profile: 'Profil',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    preview: 'Vorschau',
    requests: 'Anfragen',
    myProfile: 'Mein Profil',
    
    // Common
    filters: 'Filter',
    save: 'Speichern',
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    back: 'Zurück',
    next: 'Weiter',
    submit: 'Absenden',
    loading: 'Laden...',
    
    // Discover
    potentialCoParents: 'potenzielle Co-Eltern entsprechen Ihren Kriterien',
    noMatches: 'Keine Kandidaten entsprechen Ihren Filtern.',
    adjustFilters: 'Filter anpassen',
    
    // Profile
    manageAccount: 'Konto verwalten',
    editProfile: 'Profil bearbeiten',
    profileComplete: 'Profil vollständig',
    viewsThisWeek: 'Aufrufe diese Woche',
    accountSettings: 'Kontoeinstellungen',
    appMode: 'Ich nutze Kindly als',
    seekerLabel: 'Suchende/r',
    candidateLabel: 'Kandidat/in',
    shortlist: 'Merkliste',
    savedProfiles: 'Gespeicherte Profile anzeigen',
    safetyPrivacy: 'Sicherheit & Datenschutz',
    privacySettings: 'Datenschutzeinstellungen verwalten',
    plansSubscription: 'Pläne & Abonnement',
    manageSubscription: 'Abonnement verwalten',
    notifications: 'Benachrichtigungen',
    notificationPreferences: 'Benachrichtigungseinstellungen',
    accountSecurity: 'Kontosicherheit',
    securitySettings: 'Passwort und Sicherheit',
    appSettings: 'App-Einstellungen',
    
    // Settings
    preferences: 'Einstellungen',
    language: 'Sprache',
    darkMode: 'Dunkelmodus',
    darkModeDesc: 'Zwischen hellem und dunklem Design wechseln',
    soundEffects: 'Soundeffekte',
    soundEffectsDesc: 'In-App-Sounds aktivieren',
    communication: 'Kommunikation',
    pushNotifications: 'Push-Benachrichtigungen',
    pushNotificationsDesc: 'Push-Benachrichtigungen verwalten',
    emailPreferences: 'E-Mail-Einstellungen',
    emailPreferencesDesc: 'Newsletter und E-Mail-Benachrichtigungen',
    support: 'Unterstützung',
    helpCenter: 'Hilfezentrum',
    helpCenterDesc: 'FAQs und Hilfeartikel',
    termsOfService: 'Nutzungsbedingungen',
    termsOfServiceDesc: 'Unsere AGB lesen',
    privacyPolicy: 'Datenschutzrichtlinie',
    privacyPolicyDesc: 'Wie wir Ihre Daten behandeln',
    aboutApp: 'Über Kindly',
    
    // Safety & Privacy
    profileVisibility: 'Profilsichtbarkeit',
    profileVisibilityDesc: 'Profil für andere sichtbar machen',
    showOnlineStatus: 'Online-Status anzeigen',
    showOnlineStatusDesc: 'Anderen zeigen, wenn Sie online sind',
    showLocation: 'Standort anzeigen',
    showLocationDesc: 'Stadt in Ihrem Profil anzeigen',
    showLastActive: 'Zuletzt aktiv anzeigen',
    showLastActiveDesc: 'Zeigen, wann Sie zuletzt aktiv waren',
    blockedUsers: 'Blockierte Benutzer',
    blockedUsersDesc: 'Blockierte Profile verwalten',
    reportHistory: 'Meldeverlauf',
    reportHistoryDesc: 'Eingereichte Meldungen anzeigen',
    safetyPriority: 'Ihre Sicherheit hat Priorität',
    safetyPriorityDesc: 'Alle Gespräche werden auf unangemessene Inhalte überwacht. Melden Sie Bedenken und unser Team prüft innerhalb von 24 Stunden.',
    
    // Notifications
    newMessages: 'Neue Nachrichten',
    newMessagesDesc: 'Benachrichtigung bei neuen Nachrichten',
    newMatches: 'Neue Matches',
    newMatchesDesc: 'Jemand hat Sie zur Merkliste hinzugefügt',
    profileViews: 'Profilaufrufe',
    profileViewsDesc: 'Jemand hat Ihr Profil angesehen',
    reminders: 'Erinnerungen',
    remindersDesc: 'Aktivitätserinnerungen und Tipps',
    weeklyDigest: 'Wöchentliche Zusammenfassung',
    weeklyDigestDesc: 'Übersicht Ihrer wöchentlichen Aktivität',
    marketingEmails: 'Marketing-E-Mails',
    marketingEmailsDesc: 'Neuigkeiten, Tipps und Angebote',
    
    // Account Security
    changePassword: 'Passwort ändern',
    changePasswordDesc: 'Kontopasswort aktualisieren',
    changeEmail: 'E-Mail ändern',
    changeEmailDesc: 'E-Mail-Adresse aktualisieren',
    twoFactorAuth: 'Zwei-Faktor-Authentifizierung',
    twoFactorAuthDesc: 'Zusätzliche Sicherheitsebene hinzufügen',
    loginHistory: 'Anmeldeverlauf',
    loginHistoryDesc: 'Letzte Anmeldeaktivitäten anzeigen',
    activeSessions: 'Aktive Sitzungen',
    activeSessionsDesc: 'Angemeldete Geräte verwalten',
    dangerZone: 'Gefahrenzone',
    deleteAccount: 'Konto löschen',
    deleteAccountDesc: 'Konto und Daten dauerhaft löschen',
    newPassword: 'Neues Passwort',
    confirmPassword: 'Passwort bestätigen',
    updatePassword: 'Passwort aktualisieren',
    newEmail: 'Neue E-Mail',
    updateEmail: 'E-Mail aktualisieren',
    lastSignInLabel: 'Letzte Anmeldung',
    thisDevice: 'Dieses Gerät',
    signOutHere: 'Abmelden',
    deleteAccountConfirm: 'Ihr Konto und Ihre Daten werden dauerhaft gelöscht. Sie werden abgemeldet. Dies kann nicht rückgängig gemacht werden.',
    deleteAccountSuccess: 'Ihr Konto wurde gelöscht.',
    twoFactorComingSoon: 'Demnächst verfügbar',

    // Resources
    learnAboutCoParenting: 'Über Co-Parenting lernen',
    everythingYouNeed: 'Alles, was Sie über Co-Parenting wissen müssen',
    legalFramework: 'Rechtlicher Rahmen',
    legalFrameworkDesc: 'Schweizer Co-Parenting-Gesetze und Sorgerechtsregelungen verstehen',
    agreementTemplates: 'Vereinbarungsvorlagen',
    agreementTemplatesDesc: 'Muster für Co-Parenting-Vereinbarungen und Verträge',
    communityStories: 'Community-Geschichten',
    communityStoriesDesc: 'Echte Erfahrungen erfolgreicher Co-Parenting-Partnerschaften',
    relationshipGuidance: 'Beziehungsberatung',
    relationshipGuidanceDesc: 'Eine gesunde Co-Parenting-Partnerschaft aufbauen',
    planningTools: 'Planungstools',
    planningToolsDesc: 'Terminplanung, Budgetierung und Logistik-Checklisten',
    readingList: 'Leseliste',
    readingListDesc: 'Empfohlene Bücher über moderne Familienstrukturen',
    needMoreGuidance: 'Brauchen Sie mehr Unterstützung?',
    findProfessional: 'Fachperson finden',
    
    // Conversations
    conversations: 'Gespräche',
    ongoingChats: 'laufende Chats',
    typeMessage: 'Nachricht eingeben...',
    viewProfile: 'Profil anzeigen',
    topics: 'Themen',
    topicsCovered: 'Themen besprochen',
    markTopicsAsCovered: 'Klicken Sie auf besprochene Themen, um sie als erledigt zu markieren:',
    startConversation: 'Starten Sie das Gespräch mit einer Nachricht',
    noMessagesYet: 'Noch keine Nachrichten',
    selectConversation: 'Wählen Sie ein Gespräch zum Chatten',
    topicParenting: 'Erziehungsphilosophie',
    topicConception: 'Zeugungsmethode',
    topicCustody: 'Wochenrhythmus & Sorgerecht',
    topicLiving: 'Wohnsituation',
    topicLegal: 'Rechtliche Regelung',
    topicFinancial: 'Finanzielle Erwartungen',

    
    // Profile Edit
    backToProfile: 'Zurück zum Profil',
    updatePersonalInfo: 'Aktualisieren Sie Ihre persönlichen Daten und Einstellungen',
    complete: 'Vollständig',
    completeProfileForBetterMatches: 'Vervollständigen Sie Ihr Profil für bessere Matches',
    bio: 'Biografie',
    tellPeopleAboutYourself: 'Erzählen Sie etwas über sich...',
    aboutYou: 'Über Sie',
    work: 'Beruf',
    education: 'Ausbildung',
    location: 'Standort',
    hometown: 'Heimatort',
    spokenLanguages: 'Sprachen',
    interests: 'Interessen',
    causesAndCommunities: 'Anliegen & Gemeinschaften',
    coreValues: 'Kernwerte',
    moreAboutYou: 'Mehr über Sie',
    height: 'Größe',
    weight: 'Gewicht',
    exercise: 'Sport',
    drinking: 'Alkohol',
    smoking: 'Rauchen',
    cannabis: 'Cannabis',
    drugs: 'Drogen',
    diet: 'Ernährung',
    vaccinated: 'Geimpft',
    bloodType: 'Blutgruppe',
    eyeColour: 'Augenfarbe',
    hairColour: 'Haarfarbe',
    ethnicity: 'Ethnie',
    sexuality: 'Sexualität',
    relationshipStatus: 'Beziehungsstatus',
    householdSituation: 'Wohnsituation',
    familySituation: 'Familiensituation',
    children: 'Kinder',
    pets: 'Haustiere',
    religion: 'Religion',
    politics: 'Politik',
    starSign: 'Sternzeichen',
    coParentingPreferences: 'Co-Parenting-Präferenzen',
    lookingFor: 'Suche nach',
    openTo: 'Offen für',
    custodyPreference: 'Sorgerechts-Präferenz',
    custodyModel: 'Sorgerechtsmodell',
    conceptionMethod: 'Empfängnismethode',
    openToRelocation: 'Offen für Umzug',
    parentingPhilosophy: 'Erziehungsphilosophie',
    financialSituation: 'Finanzielle Situation',
    lifestyleRhythm: 'Lebensrhythmus',
    addLanguagesYouSpeak: 'Sprachen hinzufügen, die Sie sprechen',
    addYourInterests: 'Ihre Interessen hinzufügen',
    addCausesYouCareAbout: 'Anliegen hinzufügen, die Ihnen wichtig sind',
    addValuesYouCareAbout: 'Werte hinzufügen, die Ihnen wichtig sind',
    describeYourApproach: 'Beschreiben Sie Ihren Erziehungsansatz...',
    describeFinancialSituation: 'Beschreiben Sie Ihre finanzielle Situation...',
    describeDailyRhythm: 'Beschreiben Sie Ihren Tagesablauf und Lebensstil...',
    yes: 'Ja',
    no: 'Nein',
    child: 'Kind',
    selectUpTo: 'Wählen Sie bis zu',
    selected: 'ausgewählt',
    duringSchool: 'Während der Schulzeit',
    duringVacation: 'Während der Ferien',
    furtherInfo: 'Weitere Informationen',
    searchForCity: 'Nach Ihrer Stadt suchen...',
    searchForHometown: 'Nach Ihrem Heimatort suchen...',
    howTallAreYou: 'Wie groß sind Sie?',
    whatsYourWeight: 'Wie viel wiegen Sie?',
    howOftenWorkout: 'Wie oft trainieren Sie?',
    doYouDrink: 'Trinken Sie Alkohol?',
    doYouSmoke: 'Rauchen Sie?',
    doYouUseCannabis: 'Konsumieren Sie Cannabis?',
    doYouUseDrugs: 'Konsumieren Sie Freizeitdrogen?',
    whatsYourDiet: 'Wie ernähren Sie sich?',
    vaccinationStatus: 'Wie ist Ihr Impfstatus?',
    whatsYourBloodType: 'Welche Blutgruppe haben Sie?',
    whatColourEyes: 'Welche Augenfarbe haben Sie?',
    whatColourHair: 'Welche Haarfarbe haben Sie?',
    ethnicBackground: 'Welchen ethnischen Hintergrund haben Sie?',
    sexualOrientation: 'Welche sexuelle Orientierung haben Sie?',
    currentStatus: 'Wie ist Ihr aktueller Status?',
    livingArrangement: 'Wie ist Ihre aktuelle Wohnsituation?',
    relationshipWithFamily: 'Wie ist Ihre Beziehung zu Eltern und Geschwistern?',
    addChildrenDetails: 'Fügen Sie Ihre Kinder mit Details hinzu',
    doYouHavePets: 'Haben Sie Haustiere?',
    religiousBeliefs: 'Welche religiösen Überzeugungen haben Sie?',
    politicalViews: 'Welche politischen Ansichten haben Sie?',
    zodiacSign: 'Was ist Ihr Sternzeichen?',
    whatLanguagesDoYouKnow: 'Welche Sprachen kennen Sie?',
    languagesHelperText: 'Diese werden in Ihrem Profil angezeigt und helfen uns, Sie mit passenden Matches zu verbinden.',
    selectUpToFive: 'Wählen Sie bis zu 5',
    selectUpToThree: 'Wählen Sie bis zu 3',
    howMuchTimeWithChild: 'Wie viel Zeit möchten Sie mit Ihrem Kind verbringen?',
    preferredInvolvement: 'Bevorzugte Beteiligung',
    approachesOpenTo: 'Für welche Ansätze sind Sie offen?',
    custodyArrangementPrefs: 'Definieren Sie Ihre Sorgerechts-Präferenzen',
    describeParentingPhilosophy: 'Erzählen Sie uns von Ihrer Erziehungsphilosophie, Werten und Ihrem Ansatz zur Kindererziehung...',
    describeFinancialApproach: 'Beschreiben Sie Ihre finanzielle Situation und Ihren Ansatz zur Kostenteilung...',
    describeRoutine: 'Beschreiben Sie Ihren typischen Tag, Ihre Routine und Ihren Lebensrhythmus...',
    
    // Candidate Detail & Card
    candidateNotFound: 'Kandidat nicht gefunden',
    goBack: 'Zurück',
    backToDiscover: 'Zurück zur Entdecken-Seite',
    match: 'Match',
    message: 'Nachricht',
    aboutMe: 'Über mich',
    about: 'Über',
    lifestyle: 'Lebensstil',
    custodyPreferenceLabel: 'Sorgerechts-Präferenz',
    conceptionMethodLabel: 'Empfängnismethode',
    openToRelocationLabel: 'Offen für Umzug',
    familySupport: 'Familienunterstützung',
    active: 'Aktiv',
    sometimes: 'Manchmal',
    rarely: 'Selten',
    never: 'Nie',
    socially: 'Gesellig',
    regularly: 'Regelmäßig',
    nonSmoker: 'Nichtraucher',
    smoker: 'Raucher',
    formerSmoker: 'Ehemaliger',
    worksOutRegularly: 'Trainiert regelmäßig',
    severalTimesWeek: 'Mehrmals pro Woche',
    onceAWeek: 'Einmal pro Woche',
    occasionally: 'Gelegentlich',
    almostNever: 'Fast nie',
    doesntDrink: 'Trinkt keinen Alkohol',
    onSpecialOccasions: 'Bei besonderen Anlässen',
    whenWithFriends: 'Mit Freunden',
    mostWeekends: 'Die meisten Wochenenden',
    naturalConception: 'Natürliche Empfängnis',
    assistedReproduction: 'Assistierte Reproduktion (IVF, IUI, etc.)',
    openToBoth: 'Offen für beides',
    
    // Conversation Detail & Flow
    conversationNotFound: 'Gespräch nicht gefunden',
    stepsCompleted: 'Schritte abgeschlossen',
    conversationResponses: 'Gesprächsantworten',
    waitingForResponse: 'Warte auf nächste Antwort...',
    notAFit: 'Passt nicht',
    interested: 'Interessiert',
    bothInterested: 'Beide Seiten sind interessiert!',
    arrangeAMeeting: 'Zeit, ein Treffen zu vereinbaren und das Gespräch fortzusetzen.',
    stepOf: 'Schritt',
    continueBtn: 'Weiter',
    completeBtn: 'Abschließen',
    conversationComplete: 'Gespräch abgeschlossen!',
    responsesHaveBeenSaved: 'Ihre Antworten wurden gespeichert.',
    willBeNotified: 'wird benachrichtigt.',
    yourResponses: 'Ihre Antworten',
    notAnswered: 'Nicht beantwortet',
    viewAllConversations: 'Alle Gespräche anzeigen',
    
    // Preview
    profilePreview: 'Profilvorschau',
    seeHowSeekersView: 'So sehen Suchende Ihr Profil',
    cardView: 'Kartenansicht',
    detailView: 'Detailansicht',
    view: 'Ansehen',
    vision: 'Vision',
    completeProfileToImprove: 'Vervollständigen Sie Ihr Profil, um bei Suchenden besser anzukommen',
    
    // Not Found
    pageNotFound: '404',
    oopsPageNotFound: 'Hoppla! Seite nicht gefunden',
    returnToHome: 'Zur Startseite',
    
    // Desktop Footer
    product: 'Produkt',
    company: 'Unternehmen',
    legal: 'Rechtliches',
    howItWorks: 'Wie es funktioniert',
    pricing: 'Preise',
    aboutUs: 'Über uns',
    blog: 'Blog',
    careers: 'Karriere',
    contact: 'Kontakt',
    cookiePolicy: 'Cookie-Richtlinie',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    findYourCoParent: 'Finden Sie Ihren perfekten Co-Parenting-Partner mit Kindly.',
    
    // Children Manager
    noChildrenAdded: 'Noch keine Kinder hinzugefügt',
    addChild: 'Kind hinzufügen',
    addAnotherChild: 'Weiteres Kind hinzufügen',
    gender: 'Geschlecht',
    boy: 'Junge',
    girl: 'Mädchen',
    other: 'Andere',
    birthdate: 'Geburtsdatum',
    custody: 'Sorgerecht',
    yearsOld: 'Jahre alt',
    
    // City Search
    searching: 'Suche...',
    noCitiesFound: 'Keine Städte gefunden',
    findYourCity: 'Finden Sie Ihre Stadt',
    
    // Resource Detail
    backToResources: 'Zurück zu Ressourcen',
    sectionsLabel: 'Abschnitte',
    resourceNotFound: 'Ressource nicht gefunden',
    connectWithProfessionals: 'Verbinden Sie sich mit verifizierten Fachleuten, die Ihnen auf Ihrer Co-Parenting-Reise helfen können.',
    minRead: 'Min. Lesezeit',
    
    // Resource Content - Legal Framework
    legalFrameworkSubtitle: 'Verständnis der schweizerischen Co-Parenting-Gesetze und Sorgerechtsregelungen',
    legalSection1Title: 'Überblick über das Schweizer Familienrecht',
    legalSection1Content: 'Das Schweizer Familienrecht bietet einen umfassenden Rahmen für Co-Parenting-Vereinbarungen. Das Zivilgesetzbuch regelt Angelegenheiten der elterlichen Sorge, des Sorgerechts und des Kindesunterhalts. Jüngste Reformen haben die Bedeutung betont, dass beide Eltern aktive Rollen im Leben ihrer Kinder beibehalten.',
    legalSection2Title: 'Gemeinsame Sorgerechtsregelungen',
    legalSection2Content: 'Seit 2014 ist das gemeinsame Sorgerecht in der Schweiz die Standardregelung, es sei denn, es widerspricht dem Kindeswohl. Das bedeutet, dass beide Eltern die Entscheidungsverantwortung für wichtige Aspekte des Lebens des Kindes teilen, einschließlich Bildung, Gesundheitsversorgung und religiöser Erziehung.',
    legalSection3Title: 'Feststellung der Vaterschaft',
    legalSection3Content: 'Bei unverheirateten Eltern muss die Vaterschaft rechtlich entweder durch Anerkennung durch den Vater oder durch Gerichtsverfahren festgestellt werden. Dieser Schritt ist entscheidend für die Festlegung der rechtlichen Rechte und Pflichten beider Eltern.',
    legalSection4Title: 'Finanzielle Verantwortung',
    legalSection4Content: 'Beide Eltern sind gesetzlich verpflichtet, zum finanziellen Unterhalt ihres Kindes beizutragen. Bei der Berechnung des Kindesunterhalts werden das Einkommen beider Eltern, die Bedürfnisse des Kindes und die Zeit, die mit jedem Elternteil verbracht wird, berücksichtigt.',
    
    // Resource Content - Agreement Templates
    agreementTemplatesSubtitle: 'Muster für Co-Parenting-Vereinbarungen und Verträge',
    agreementSection1Title: 'Warum schriftliche Vereinbarungen wichtig sind',
    agreementSection1Content: 'Eine schriftliche Co-Parenting-Vereinbarung hilft, Missverständnisse zu vermeiden und bietet beiden Parteien eine klare Referenz. Während mündliche Vereinbarungen funktionieren können, schützt eine Dokumentation die Interessen aller.',
    agreementSection2Title: 'Wichtige Komponenten',
    agreementSection2Content: 'Ihre Vereinbarung sollte umfassen: Sorgerechtsplan, Entscheidungsverantwortlichkeiten, finanzielle Beiträge, Kommunikationsprotokolle, Methoden zur Streitbeilegung und Bestimmungen für zukünftige Änderungen.',
    agreementSection3Title: 'Rechtliche Überprüfung',
    agreementSection3Content: 'Wir empfehlen dringend, jede Co-Parenting-Vereinbarung vor der Unterzeichnung von einem Familienrechtsanwalt überprüfen zu lassen. Dies stellt sicher, dass die Vereinbarung durchsetzbar ist und die Rechte beider Parteien schützt.',
    
    // Resource Content - Community Stories
    communityStoriesSubtitle: 'Echte Erfahrungen aus erfolgreichen Co-Parenting-Partnerschaften',
    communitySection1Title: 'Maria & Thomas - Zürich',
    communitySection1Content: '„Wir haben uns vor zwei Jahren über Kindly kennengelernt und haben jetzt eine wunderschöne Tochter zusammen. Der Schlüssel zu unserem Erfolg war klare Kommunikation und gegenseitiger Respekt. Wir haben regelmäßige Besprechungen eingeplant, um Erziehungsentscheidungen zu besprechen und die Bedürfnisse unserer Tochter immer an erste Stelle gesetzt."',
    communitySection2Title: 'Sophie & Jan - Basel',
    communitySection2Content: '„Als alleinstehende Frau Ende 30 dachte ich, mein Traum, Mutter zu werden, würde verblassen. Jan über diese Plattform zu finden, hat alles verändert. Wir haben uns Zeit genommen, uns kennenzulernen, haben gemeinsam einen Berater getroffen und einen detaillierten Elternplan erstellt, bevor wir weitergegangen sind."',
    communitySection3Title: 'Tipps aus unserer Community',
    communitySection3Content: 'Häufige Ratschläge von erfolgreichen Co-Eltern: Nehmen Sie sich Zeit, Ihren potenziellen Co-Elternteil wirklich kennenzulernen, seien Sie ehrlich über Ihre Erwartungen, suchen Sie professionelle Beratung und denken Sie daran, dass Flexibilität und Geduld unerlässlich sind.',
    
    // Resource Content - Relationship Guidance
    relationshipGuidanceSubtitle: 'Aufbau einer gesunden Co-Parenting-Partnerschaft',
    relationshipSection1Title: 'Kommunikation ist der Schlüssel',
    relationshipSection1Content: 'Erfolgreiche Co-Parenting-Beziehungen basieren auf offener, ehrlicher Kommunikation. Legen Sie frühzeitig bevorzugte Kommunikationsmethoden fest und verpflichten Sie sich zu regelmäßigen Gesprächen über das Wohlbefinden und die Entwicklung Ihres Kindes.',
    relationshipSection2Title: 'Grenzen setzen',
    relationshipSection2Content: 'Klare Grenzen helfen, eine gesunde Co-Parenting-Beziehung aufrechtzuerhalten. Besprechen und vereinbaren Sie Erwartungen bezüglich persönlichem Raum, romantischen Beziehungen, Erziehungsentscheidungen und der Einbeziehung der erweiterten Familie.',
    relationshipSection3Title: 'Konfliktlösung',
    relationshipSection3Content: 'Meinungsverschiedenheiten sind in jeder Beziehung normal. Entwickeln Sie Strategien für den konstruktiven Umgang mit Konflikten, wie sich Zeit zum Abkühlen nehmen, "Ich"-Aussagen verwenden und sich auf Lösungen statt auf Schuldzuweisungen konzentrieren.',
    
    // Resource Content - Planning Tools
    planningToolsSubtitle: 'Terminplanung, Budgetierung und Logistik-Checklisten',
    planningSection1Title: 'Sorgerechts-Zeitplanung',
    planningSection1Content: 'Erwägen Sie verschiedene Zeitplanoptionen: abwechselnde Wochen, 2-2-3-Rotation oder andere Vereinbarungen, die für Ihre Situation funktionieren. Verwenden Sie gemeinsame Kalender, um Sorgerechtszeit, Termine und Aktivitäten zu verfolgen.',
    planningSection2Title: 'Finanzplanungs-Checkliste',
    planningSection2Content: 'Wichtige finanzielle Überlegungen: medizinische Kosten und Versicherung, Kinderbetreuungskosten, Bildungsfonds, Kleidung und Grundbedarf, außerschulische Aktivitäten und Notfallfonds.',
    planningSection3Title: 'Logistik-Koordination',
    planningSection3Content: 'Praktische Angelegenheiten, die zu klären sind: Übergabeorte und -zeiten, Transportverantwortlichkeiten, Kommunikation über Tagesabläufe, Umgang mit Feiertagen und besonderen Anlässen sowie Notfallkontaktprotokolle.',
    
    // Resource Content - Reading List
    readingListSubtitle: 'Empfohlene Bücher über moderne Familienstrukturen',
    readingSection1Title: 'Wichtige Lektüre',
    readingSection1Content: '„Co-Parenting 101" von Deesha Philyaw - Ein praktischer Leitfaden zur geteilten Elternschaft. „The Co-Parents\' Handbook" von Karen Bonnell - Strategien für effektive Zusammenarbeit. „Modern Families" von Joshua Gamson - Erforschung vielfältiger Familienstrukturen.',
    readingSection2Title: 'Für Kinder',
    readingSection2Content: 'Altersgerechte Bücher, um Kindern ihre Familienstruktur zu erklären: „Zwei Zuhause" von Claire Masurel, „Mamas Haus, Papas Haus für Kinder" von Isolina Ricci und „Auf meinen eigenen zwei Füßen stehen" von Tamara Schmitz.',
    readingSection3Title: 'Rechtliche & finanzielle Ressourcen',
    readingSection3Content: '„Der vollständige Leitfaden zu Sorgerechtsvereinbarungen" - Verstehen Sie Ihre rechtlichen Optionen. „Geld und Familie" von Liz Frazier - Finanzplanung für moderne Familien.',
  },
  fr: {
    // Navigation
    discover: 'Découvrir',
    resources: 'Ressources',
    chats: 'Messages',
    profile: 'Profil',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    preview: 'Aperçu',
    requests: 'Demandes',
    myProfile: 'Mon Profil',
    
    // Common
    filters: 'Filtres',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    back: 'Retour',
    next: 'Suivant',
    submit: 'Soumettre',
    loading: 'Chargement...',
    
    // Discover
    potentialCoParents: 'co-parents potentiels correspondent à vos critères',
    noMatches: 'Aucun candidat ne correspond à vos filtres.',
    adjustFilters: 'Ajuster les filtres',
    
    // Profile
    manageAccount: 'Gérer votre compte',
    editProfile: 'Modifier le profil',
    profileComplete: 'Profil complet',
    viewsThisWeek: 'Vues cette semaine',
    accountSettings: 'Paramètres du compte',
    appMode: 'J\'utilise Kindly comme',
    seekerLabel: 'Chercheur/se',
    candidateLabel: 'Candidat/e',
    shortlist: 'Liste restreinte',
    savedProfiles: 'Voir vos profils sauvegardés',
    safetyPrivacy: 'Sécurité & Confidentialité',
    privacySettings: 'Gérer vos paramètres de confidentialité',
    plansSubscription: 'Plans & Abonnement',
    manageSubscription: 'Gérer votre abonnement',
    notifications: 'Notifications',
    notificationPreferences: 'Gérer les préférences de notification',
    accountSecurity: 'Sécurité du compte',
    securitySettings: 'Mot de passe et sécurité',
    appSettings: 'Paramètres de l\'application',
    
    // Settings
    preferences: 'Préférences',
    language: 'Langue',
    darkMode: 'Mode sombre',
    darkModeDesc: 'Basculer entre le thème clair et sombre',
    soundEffects: 'Effets sonores',
    soundEffectsDesc: 'Activer les sons de l\'application',
    communication: 'Communication',
    pushNotifications: 'Notifications push',
    pushNotificationsDesc: 'Gérer les notifications push',
    emailPreferences: 'Préférences e-mail',
    emailPreferencesDesc: 'Newsletter et notifications par e-mail',
    support: 'Support',
    helpCenter: 'Centre d\'aide',
    helpCenterDesc: 'FAQ et articles d\'aide',
    termsOfService: 'Conditions d\'utilisation',
    termsOfServiceDesc: 'Lire nos conditions générales',
    privacyPolicy: 'Politique de confidentialité',
    privacyPolicyDesc: 'Comment nous traitons vos données',
    aboutApp: 'À propos de Kindly',
    
    // Safety & Privacy
    profileVisibility: 'Visibilité du profil',
    profileVisibilityDesc: 'Rendre votre profil visible aux autres',
    showOnlineStatus: 'Afficher le statut en ligne',
    showOnlineStatusDesc: 'Permettre aux autres de voir quand vous êtes en ligne',
    showLocation: 'Afficher la localisation',
    showLocationDesc: 'Afficher votre ville sur votre profil',
    showLastActive: 'Afficher dernière activité',
    showLastActiveDesc: 'Montrer quand vous étiez actif en dernier',
    blockedUsers: 'Utilisateurs bloqués',
    blockedUsersDesc: 'Gérer les profils bloqués',
    reportHistory: 'Historique des signalements',
    reportHistoryDesc: 'Voir vos signalements soumis',
    safetyPriority: 'Votre sécurité est notre priorité',
    safetyPriorityDesc: 'Toutes les conversations sont surveillées. Signalez toute préoccupation et notre équipe examinera sous 24 heures.',
    
    // Notifications
    newMessages: 'Nouveaux messages',
    newMessagesDesc: 'Être notifié des nouveaux messages',
    newMatches: 'Nouveaux matchs',
    newMatchesDesc: 'Quelqu\'un vous a ajouté à sa liste',
    profileViews: 'Vues du profil',
    profileViewsDesc: 'Quelqu\'un a consulté votre profil',
    reminders: 'Rappels',
    remindersDesc: 'Rappels d\'activité et conseils',
    weeklyDigest: 'Résumé hebdomadaire',
    weeklyDigestDesc: 'Résumé de votre activité hebdomadaire',
    marketingEmails: 'E-mails marketing',
    marketingEmailsDesc: 'Actualités, conseils et offres spéciales',
    
    // Account Security
    changePassword: 'Changer le mot de passe',
    changePasswordDesc: 'Mettre à jour le mot de passe',
    changeEmail: 'Changer l\'e-mail',
    changeEmailDesc: 'Mettre à jour l\'adresse e-mail',
    twoFactorAuth: 'Authentification à deux facteurs',
    twoFactorAuthDesc: 'Ajouter une couche de sécurité supplémentaire',
    loginHistory: 'Historique de connexion',
    loginHistoryDesc: 'Voir votre activité de connexion récente',
    activeSessions: 'Sessions actives',
    activeSessionsDesc: 'Gérer les appareils connectés',
    dangerZone: 'Zone de danger',
    deleteAccount: 'Supprimer le compte',
    deleteAccountDesc: 'Supprimer définitivement votre compte et vos données',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    updatePassword: 'Mettre à jour le mot de passe',
    newEmail: 'Nouvelle adresse e-mail',
    updateEmail: 'Mettre à jour l\'e-mail',
    lastSignInLabel: 'Dernière connexion',
    thisDevice: 'Cet appareil',
    signOutHere: 'Se déconnecter',
    deleteAccountConfirm: 'Votre compte et vos données seront définitivement supprimés. Vous serez déconnecté. Cette action est irréversible.',
    deleteAccountSuccess: 'Votre compte a été supprimé.',
    twoFactorComingSoon: 'Bientôt disponible',

    // Resources
    learnAboutCoParenting: 'En savoir plus sur la coparentalité',
    everythingYouNeed: 'Tout ce que vous devez savoir sur la coparentalité',
    legalFramework: 'Cadre juridique',
    legalFrameworkDesc: 'Comprendre les lois suisses sur la coparentalité',
    agreementTemplates: 'Modèles d\'accord',
    agreementTemplatesDesc: 'Exemples d\'accords et contrats de coparentalité',
    communityStories: 'Témoignages',
    communityStoriesDesc: 'Expériences réelles de coparentalités réussies',
    relationshipGuidance: 'Conseils relationnels',
    relationshipGuidanceDesc: 'Construire un partenariat de coparentalité sain',
    planningTools: 'Outils de planification',
    planningToolsDesc: 'Planification, budget et listes de contrôle',
    readingList: 'Liste de lecture',
    readingListDesc: 'Livres recommandés sur les structures familiales modernes',
    needMoreGuidance: 'Besoin de plus de conseils?',
    findProfessional: 'Trouver un professionnel',
    
    // Conversations
    conversations: 'Conversations',
    ongoingChats: 'discussions en cours',
    typeMessage: 'Écrire un message...',
    viewProfile: 'Voir le profil',
    topics: 'Sujets',
    topicsCovered: 'sujets couverts',
    markTopicsAsCovered: 'Cliquez sur les sujets discutés pour les marquer comme couverts:',
    startConversation: 'Commencez la conversation en envoyant un message',
    noMessagesYet: 'Pas encore de messages',
    selectConversation: 'Sélectionnez une conversation pour commencer à discuter',
    topicParenting: 'Philosophie parentale',
    topicConception: 'Méthode de conception',
    topicCustody: 'Rythme hebdomadaire & Garde',
    topicLiving: 'Situation de logement',
    topicLegal: 'Configuration juridique',
    topicFinancial: 'Attentes financières',

    
    // Profile Edit
    backToProfile: 'Retour au profil',
    updatePersonalInfo: 'Mettez à jour vos informations personnelles et préférences',
    complete: 'Complet',
    completeProfileForBetterMatches: 'Complétez votre profil pour de meilleurs matchs',
    bio: 'Bio',
    tellPeopleAboutYourself: 'Parlez de vous...',
    aboutYou: 'À propos de vous',
    work: 'Travail',
    education: 'Éducation',
    location: 'Localisation',
    hometown: 'Ville natale',
    spokenLanguages: 'Langues',
    interests: 'Intérêts',
    causesAndCommunities: 'Causes & Communautés',
    coreValues: 'Valeurs fondamentales',
    moreAboutYou: 'Plus sur vous',
    height: 'Taille',
    weight: 'Poids',
    exercise: 'Exercice',
    drinking: 'Alcool',
    smoking: 'Tabac',
    cannabis: 'Cannabis',
    drugs: 'Drogues',
    diet: 'Régime',
    vaccinated: 'Vacciné',
    bloodType: 'Groupe sanguin',
    eyeColour: 'Couleur des yeux',
    hairColour: 'Couleur des cheveux',
    ethnicity: 'Origine ethnique',
    sexuality: 'Sexualité',
    relationshipStatus: 'Situation amoureuse',
    householdSituation: 'Situation de logement',
    familySituation: 'Situation familiale',
    children: 'Enfants',
    pets: 'Animaux',
    religion: 'Religion',
    politics: 'Politique',
    starSign: 'Signe astrologique',
    coParentingPreferences: 'Préférences de coparentalité',
    lookingFor: 'Je recherche',
    openTo: 'Ouvert à',
    custodyPreference: 'Préférence de garde',
    custodyModel: 'Modèle de garde',
    conceptionMethod: 'Méthode de conception',
    openToRelocation: 'Ouvert au déménagement',
    parentingPhilosophy: 'Philosophie parentale',
    financialSituation: 'Situation financière',
    lifestyleRhythm: 'Rythme de vie',
    addLanguagesYouSpeak: 'Ajoutez les langues que vous parlez',
    addYourInterests: 'Ajoutez vos intérêts',
    addCausesYouCareAbout: 'Ajoutez les causes qui vous tiennent à cœur',
    addValuesYouCareAbout: 'Ajoutez les valeurs qui vous tiennent à cœur',
    describeYourApproach: 'Décrivez votre approche parentale...',
    describeFinancialSituation: 'Décrivez votre situation financière...',
    describeDailyRhythm: 'Décrivez votre rythme quotidien et votre style de vie...',
    yes: 'Oui',
    no: 'Non',
    child: 'enfant',
    selectUpTo: 'Sélectionnez jusqu\'à',
    selected: 'sélectionné(s)',
    duringSchool: 'Pendant l\'école',
    duringVacation: 'Pendant les vacances',
    furtherInfo: 'Informations supplémentaires',
    searchForCity: 'Recherchez votre ville...',
    searchForHometown: 'Recherchez votre ville natale...',
    howTallAreYou: 'Quelle est votre taille?',
    whatsYourWeight: 'Quel est votre poids?',
    howOftenWorkout: 'À quelle fréquence faites-vous du sport?',
    doYouDrink: 'Buvez-vous de l\'alcool?',
    doYouSmoke: 'Fumez-vous?',
    doYouUseCannabis: 'Consommez-vous du cannabis?',
    doYouUseDrugs: 'Consommez-vous des drogues récréatives?',
    whatsYourDiet: 'Quel est votre régime alimentaire?',
    vaccinationStatus: 'Quel est votre statut vaccinal?',
    whatsYourBloodType: 'Quel est votre groupe sanguin?',
    whatColourEyes: 'Quelle est la couleur de vos yeux?',
    whatColourHair: 'Quelle est la couleur de vos cheveux?',
    ethnicBackground: 'Quelle est votre origine ethnique?',
    sexualOrientation: 'Quelle est votre orientation sexuelle?',
    currentStatus: 'Quelle est votre situation actuelle?',
    livingArrangement: 'Quelle est votre situation de logement actuelle?',
    relationshipWithFamily: 'Comment est votre relation avec vos parents et frères/sœurs?',
    addChildrenDetails: 'Ajoutez vos enfants avec leurs détails',
    doYouHavePets: 'Avez-vous des animaux?',
    religiousBeliefs: 'Quelles sont vos croyances religieuses?',
    politicalViews: 'Quelles sont vos opinions politiques?',
    zodiacSign: 'Quel est votre signe du zodiaque?',
    whatLanguagesDoYouKnow: 'Quelles langues connaissez-vous?',
    languagesHelperText: 'Ces informations seront affichées sur votre profil et nous aideront à vous connecter avec des personnes parlant vos langues.',
    selectUpToFive: 'Sélectionnez jusqu\'à 5',
    selectUpToThree: 'Sélectionnez jusqu\'à 3',
    howMuchTimeWithChild: 'Combien de temps souhaitez-vous passer avec votre enfant?',
    preferredInvolvement: 'Implication préférée',
    approachesOpenTo: 'Quelles approches vous conviennent?',
    custodyArrangementPrefs: 'Définissez vos préférences de garde',
    describeParentingPhilosophy: 'Parlez-nous de votre philosophie parentale, vos valeurs et votre approche de l\'éducation des enfants...',
    describeFinancialApproach: 'Décrivez votre situation financière et votre approche du partage des coûts...',
    describeRoutine: 'Décrivez votre journée type, votre routine et votre rythme de vie...',
    
    // Candidate Detail & Card
    candidateNotFound: 'Candidat non trouvé',
    goBack: 'Retour',
    backToDiscover: 'Retour à Découvrir',
    match: 'correspondance',
    message: 'Message',
    aboutMe: 'À propos de moi',
    about: 'À propos',
    lifestyle: 'Mode de vie',
    custodyPreferenceLabel: 'Préférence de garde',
    conceptionMethodLabel: 'Méthode de conception',
    openToRelocationLabel: 'Ouvert au déménagement',
    familySupport: 'Soutien familial',
    active: 'Actif',
    sometimes: 'Parfois',
    rarely: 'Rarement',
    never: 'Jamais',
    socially: 'En société',
    regularly: 'Régulièrement',
    nonSmoker: 'Non-fumeur',
    smoker: 'Fumeur',
    formerSmoker: 'Ancien',
    worksOutRegularly: 'Fait du sport régulièrement',
    severalTimesWeek: 'Plusieurs fois par semaine',
    onceAWeek: 'Une fois par semaine',
    occasionally: 'Occasionnellement',
    almostNever: 'Presque jamais',
    doesntDrink: 'Ne boit pas d\'alcool',
    onSpecialOccasions: 'Pour les occasions spéciales',
    whenWithFriends: 'Entre amis',
    mostWeekends: 'La plupart des week-ends',
    naturalConception: 'Conception naturelle',
    assistedReproduction: 'Reproduction assistée (FIV, IUI, etc.)',
    openToBoth: 'Ouvert aux deux',
    
    // Conversation Detail & Flow
    conversationNotFound: 'Conversation non trouvée',
    stepsCompleted: 'étapes terminées',
    conversationResponses: 'Réponses de conversation',
    waitingForResponse: 'En attente de la prochaine réponse...',
    notAFit: 'Pas compatible',
    interested: 'Intéressé',
    bothInterested: 'Les deux parties sont intéressées!',
    arrangeAMeeting: 'Il est temps d\'organiser une rencontre et de poursuivre la conversation.',
    stepOf: 'Étape',
    continueBtn: 'Continuer',
    completeBtn: 'Terminer',
    conversationComplete: 'Conversation terminée!',
    responsesHaveBeenSaved: 'Vos réponses ont été enregistrées.',
    willBeNotified: 'sera notifié.',
    yourResponses: 'Vos réponses',
    notAnswered: 'Non répondu',
    viewAllConversations: 'Voir toutes les conversations',
    
    // Preview
    profilePreview: 'Aperçu du profil',
    seeHowSeekersView: 'Voyez comment les chercheurs voient votre profil',
    cardView: 'Vue carte',
    detailView: 'Vue détaillée',
    view: 'Voir',
    vision: 'Vision',
    completeProfileToImprove: 'Complétez votre profil pour améliorer votre visibilité auprès des chercheurs',
    
    // Not Found
    pageNotFound: '404',
    oopsPageNotFound: 'Oups! Page non trouvée',
    returnToHome: 'Retour à l\'accueil',
    
    // Desktop Footer
    product: 'Produit',
    company: 'Entreprise',
    legal: 'Mentions légales',
    howItWorks: 'Comment ça marche',
    pricing: 'Tarifs',
    aboutUs: 'À propos de nous',
    blog: 'Blog',
    careers: 'Carrières',
    contact: 'Contact',
    cookiePolicy: 'Politique des cookies',
    allRightsReserved: 'Tous droits réservés.',
    findYourCoParent: 'Trouvez votre partenaire de coparentalité idéal avec Kindly.',
    
    // Children Manager
    noChildrenAdded: 'Aucun enfant ajouté',
    addChild: 'Ajouter un enfant',
    addAnotherChild: 'Ajouter un autre enfant',
    gender: 'Genre',
    boy: 'Garçon',
    girl: 'Fille',
    other: 'Autre',
    birthdate: 'Date de naissance',
    custody: 'Garde',
    yearsOld: 'ans',
    
    // City Search
    searching: 'Recherche...',
    noCitiesFound: 'Aucune ville trouvée',
    findYourCity: 'Trouvez votre ville',
    
    // Resource Detail
    backToResources: 'Retour aux ressources',
    sectionsLabel: 'sections',
    resourceNotFound: 'Ressource non trouvée',
    connectWithProfessionals: 'Connectez-vous avec des professionnels vérifiés qui peuvent vous aider dans votre parcours de coparentalité.',
    minRead: 'min de lecture',
    
    // Resource Content - Legal Framework
    legalFrameworkSubtitle: 'Comprendre les lois suisses sur la coparentalité et les arrangements de garde',
    legalSection1Title: 'Aperçu du droit de la famille suisse',
    legalSection1Content: 'Le droit de la famille suisse fournit un cadre complet pour les arrangements de coparentalité. Le Code civil (Zivilgesetzbuch) régit les questions relatives à l\'autorité parentale, à la garde et à la pension alimentaire. Des réformes récentes ont souligné l\'importance pour les deux parents de maintenir des rôles actifs dans la vie de leurs enfants.',
    legalSection2Title: 'Arrangements de garde conjointe',
    legalSection2Content: 'Depuis 2014, la garde conjointe est l\'arrangement par défaut en Suisse, sauf si cela est contraire à l\'intérêt supérieur de l\'enfant. Cela signifie que les deux parents partagent les responsabilités décisionnelles pour les aspects majeurs de la vie de l\'enfant, y compris l\'éducation, les soins de santé et l\'éducation religieuse.',
    legalSection3Title: 'Établissement de la paternité',
    legalSection3Content: 'Pour les parents non mariés, la paternité doit être légalement établie soit par reconnaissance du père, soit par procédure judiciaire. Cette étape est cruciale pour établir les droits et responsabilités légaux des deux parents.',
    legalSection4Title: 'Responsabilités financières',
    legalSection4Content: 'Les deux parents sont légalement tenus de contribuer au soutien financier de leur enfant. Les calculs de pension alimentaire prennent en compte les revenus des deux parents, les besoins de l\'enfant et le temps passé avec chaque parent.',
    
    // Resource Content - Agreement Templates
    agreementTemplatesSubtitle: 'Exemples d\'accords et contrats de coparentalité',
    agreementSection1Title: 'Pourquoi les accords écrits sont importants',
    agreementSection1Content: 'Un accord de coparentalité écrit aide à prévenir les malentendus et fournit une référence claire pour les deux parties. Bien que les accords verbaux puissent fonctionner, la documentation protège les intérêts de tous.',
    agreementSection2Title: 'Composantes clés à inclure',
    agreementSection2Content: 'Votre accord devrait couvrir : le calendrier de garde, les responsabilités décisionnelles, les contributions financières, les protocoles de communication, les méthodes de résolution des conflits et les dispositions pour les modifications futures.',
    agreementSection3Title: 'Examen juridique',
    agreementSection3Content: 'Nous recommandons fortement de faire examiner tout accord de coparentalité par un avocat en droit de la famille avant de signer. Cela garantit que l\'accord est exécutoire et protège les droits des deux parties.',
    
    // Resource Content - Community Stories
    communityStoriesSubtitle: 'Expériences réelles de partenariats de coparentalité réussis',
    communitySection1Title: 'Maria & Thomas - Zurich',
    communitySection1Content: '« Nous nous sommes rencontrés via Kindly il y a deux ans et nous avons maintenant une magnifique fille ensemble. La clé de notre succès a été une communication claire et le respect mutuel. Nous avons planifié des points réguliers pour discuter des décisions parentales et avons toujours mis les besoins de notre fille en premier. »',
    communitySection2Title: 'Sophie & Jan - Bâle',
    communitySection2Content: '« En tant que femme célibataire à la fin de la trentaine, je pensais que mon rêve de devenir mère s\'évanouissait. Trouver Jan via cette plateforme a tout changé. Nous avons pris le temps de nous connaître, avons rencontré un conseiller ensemble et avons créé un plan parental détaillé avant de continuer. »',
    communitySection3Title: 'Conseils de notre communauté',
    communitySection3Content: 'Conseils courants des coparents réussis : prenez le temps de vraiment connaître votre coparent potentiel, soyez honnête sur vos attentes, cherchez des conseils professionnels et rappelez-vous que la flexibilité et la patience sont essentielles.',
    
    // Resource Content - Relationship Guidance
    relationshipGuidanceSubtitle: 'Construire un partenariat de coparentalité sain',
    relationshipSection1Title: 'La communication est essentielle',
    relationshipSection1Content: 'Les relations de coparentalité réussies reposent sur une communication ouverte et honnête. Établissez tôt les méthodes de communication préférées et engagez-vous à des points réguliers sur le bien-être et le développement de votre enfant.',
    relationshipSection2Title: 'Fixer des limites',
    relationshipSection2Content: 'Des limites claires aident à maintenir une relation de coparentalité saine. Discutez et convenez des attentes concernant l\'espace personnel, les relations amoureuses, les décisions parentales et l\'implication de la famille élargie.',
    relationshipSection3Title: 'Résolution des conflits',
    relationshipSection3Content: 'Les désaccords sont normaux dans toute relation. Développez des stratégies pour gérer les conflits de manière constructive, comme prendre le temps de se calmer, utiliser des déclarations en "je" et se concentrer sur les solutions plutôt que sur les reproches.',
    
    // Resource Content - Planning Tools
    planningToolsSubtitle: 'Planification, budget et listes de vérification logistique',
    planningSection1Title: 'Planification du calendrier de garde',
    planningSection1Content: 'Considérez diverses options de calendrier : semaines alternées, rotation 2-2-3 ou autres arrangements adaptés à votre situation. Utilisez des calendriers partagés pour suivre le temps de garde, les rendez-vous et les activités.',
    planningSection2Title: 'Liste de vérification de planification financière',
    planningSection2Content: 'Considérations financières clés : frais médicaux et assurance, frais de garde d\'enfants, fonds d\'éducation, vêtements et essentiels, activités extrascolaires et fonds d\'urgence.',
    planningSection3Title: 'Coordination logistique',
    planningSection3Content: 'Questions pratiques à aborder : lieux et horaires d\'échange, responsabilités de transport, communication sur les routines quotidiennes, gestion des vacances et occasions spéciales, et protocoles de contact d\'urgence.',
    
    // Resource Content - Reading List
    readingListSubtitle: 'Livres recommandés sur les structures familiales modernes',
    readingSection1Title: 'Lectures essentielles',
    readingSection1Content: '« Co-Parenting 101 » par Deesha Philyaw - Un guide pratique pour naviguer la parentalité partagée. « The Co-Parents\' Handbook » par Karen Bonnell - Stratégies pour une collaboration efficace. « Modern Families » par Joshua Gamson - Explorer les structures familiales diverses.',
    readingSection2Title: 'Pour les enfants',
    readingSection2Content: 'Livres adaptés à l\'âge pour aider les enfants à comprendre leur structure familiale : « Deux maisons » de Claire Masurel, « La maison de maman, la maison de papa pour les enfants » d\'Isolina Ricci et « Debout sur mes deux pieds » de Tamara Schmitz.',
    readingSection3Title: 'Ressources juridiques et financières',
    readingSection3Content: '« Le guide complet des accords de garde » - Comprendre vos options légales. « Argent et famille » de Liz Frazier - Planification financière pour les familles modernes.',
  },
  es: {
    // Navigation
    discover: 'Descubrir',
    resources: 'Recursos',
    chats: 'Mensajes',
    profile: 'Perfil',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    preview: 'Vista previa',
    requests: 'Solicitudes',
    myProfile: 'Mi Perfil',
    
    // Common
    filters: 'Filtros',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    back: 'Atrás',
    next: 'Siguiente',
    submit: 'Enviar',
    loading: 'Cargando...',
    
    // Discover
    potentialCoParents: 'co-padres potenciales coinciden con sus criterios',
    noMatches: 'Ningún candidato coincide con sus filtros.',
    adjustFilters: 'Ajustar filtros',
    
    // Profile
    manageAccount: 'Gestionar su cuenta',
    editProfile: 'Editar perfil',
    profileComplete: 'Perfil completo',
    viewsThisWeek: 'Visitas esta semana',
    accountSettings: 'Configuración de la cuenta',
    appMode: 'Uso Kindly como',
    seekerLabel: 'Buscador/a',
    candidateLabel: 'Candidato/a',
    shortlist: 'Lista de favoritos',
    savedProfiles: 'Ver perfiles guardados',
    safetyPrivacy: 'Seguridad y Privacidad',
    privacySettings: 'Gestionar configuración de privacidad',
    plansSubscription: 'Planes y Suscripción',
    manageSubscription: 'Gestionar su suscripción',
    notifications: 'Notificaciones',
    notificationPreferences: 'Gestionar preferencias de notificación',
    accountSecurity: 'Seguridad de la cuenta',
    securitySettings: 'Contraseña y seguridad',
    appSettings: 'Configuración de la aplicación',
    
    // Settings
    preferences: 'Preferencias',
    language: 'Idioma',
    darkMode: 'Modo oscuro',
    darkModeDesc: 'Cambiar entre tema claro y oscuro',
    soundEffects: 'Efectos de sonido',
    soundEffectsDesc: 'Activar sonidos de la aplicación',
    communication: 'Comunicación',
    pushNotifications: 'Notificaciones push',
    pushNotificationsDesc: 'Gestionar notificaciones push',
    emailPreferences: 'Preferencias de correo',
    emailPreferencesDesc: 'Newsletter y notificaciones por correo',
    support: 'Soporte',
    helpCenter: 'Centro de ayuda',
    helpCenterDesc: 'Preguntas frecuentes y artículos de ayuda',
    termsOfService: 'Términos de servicio',
    termsOfServiceDesc: 'Leer nuestros términos y condiciones',
    privacyPolicy: 'Política de privacidad',
    privacyPolicyDesc: 'Cómo manejamos sus datos',
    aboutApp: 'Acerca de Kindly',
    
    // Safety & Privacy
    profileVisibility: 'Visibilidad del perfil',
    profileVisibilityDesc: 'Hacer su perfil visible para otros',
    showOnlineStatus: 'Mostrar estado en línea',
    showOnlineStatusDesc: 'Permitir que otros vean cuando está en línea',
    showLocation: 'Mostrar ubicación',
    showLocationDesc: 'Mostrar su ciudad en su perfil',
    showLastActive: 'Mostrar última actividad',
    showLastActiveDesc: 'Mostrar cuándo estuvo activo por última vez',
    blockedUsers: 'Usuarios bloqueados',
    blockedUsersDesc: 'Gestionar perfiles bloqueados',
    reportHistory: 'Historial de reportes',
    reportHistoryDesc: 'Ver sus reportes enviados',
    safetyPriority: 'Su seguridad es nuestra prioridad',
    safetyPriorityDesc: 'Todas las conversaciones son monitoreadas. Reporte cualquier preocupación y nuestro equipo revisará en 24 horas.',
    
    // Notifications
    newMessages: 'Nuevos mensajes',
    newMessagesDesc: 'Recibir notificación de nuevos mensajes',
    newMatches: 'Nuevas coincidencias',
    newMatchesDesc: 'Alguien te agregó a su lista',
    profileViews: 'Vistas del perfil',
    profileViewsDesc: 'Alguien vio tu perfil',
    reminders: 'Recordatorios',
    remindersDesc: 'Recordatorios de actividad y consejos',
    weeklyDigest: 'Resumen semanal',
    weeklyDigestDesc: 'Resumen de tu actividad semanal',
    marketingEmails: 'Correos de marketing',
    marketingEmailsDesc: 'Noticias, consejos y ofertas especiales',
    
    // Account Security
    changePassword: 'Cambiar contraseña',
    changePasswordDesc: 'Actualizar la contraseña de la cuenta',
    changeEmail: 'Cambiar correo',
    changeEmailDesc: 'Actualizar la dirección de correo',
    twoFactorAuth: 'Autenticación de dos factores',
    twoFactorAuthDesc: 'Añadir una capa extra de seguridad',
    loginHistory: 'Historial de inicio de sesión',
    loginHistoryDesc: 'Ver su actividad de inicio de sesión reciente',
    activeSessions: 'Sesiones activas',
    activeSessionsDesc: 'Gestionar dispositivos conectados',
    dangerZone: 'Zona de peligro',
    deleteAccount: 'Eliminar cuenta',
    deleteAccountDesc: 'Eliminar permanentemente su cuenta y datos',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar contraseña',
    updatePassword: 'Actualizar contraseña',
    newEmail: 'Nuevo correo electrónico',
    updateEmail: 'Actualizar correo',
    lastSignInLabel: 'Último inicio de sesión',
    thisDevice: 'Este dispositivo',
    signOutHere: 'Cerrar sesión',
    deleteAccountConfirm: 'Se eliminarán permanentemente su cuenta y sus datos. Se cerrará la sesión. Esta acción no se puede deshacer.',
    deleteAccountSuccess: 'Su cuenta ha sido eliminada.',
    twoFactorComingSoon: 'Próximamente',

    // Resources
    learnAboutCoParenting: 'Aprender sobre coparentalidad',
    everythingYouNeed: 'Todo lo que necesita saber sobre coparentalidad',
    legalFramework: 'Marco legal',
    legalFrameworkDesc: 'Entender las leyes suizas de coparentalidad',
    agreementTemplates: 'Plantillas de acuerdo',
    agreementTemplatesDesc: 'Ejemplos de acuerdos y contratos de coparentalidad',
    communityStories: 'Historias de la comunidad',
    communityStoriesDesc: 'Experiencias reales de coparentalidades exitosas',
    relationshipGuidance: 'Orientación relacional',
    relationshipGuidanceDesc: 'Construir una asociación de coparentalidad saludable',
    planningTools: 'Herramientas de planificación',
    planningToolsDesc: 'Programación, presupuesto y listas de verificación',
    readingList: 'Lista de lectura',
    readingListDesc: 'Libros recomendados sobre estructuras familiares modernas',
    needMoreGuidance: '¿Necesita más orientación?',
    findProfessional: 'Encontrar un profesional',
    
    // Conversations
    conversations: 'Conversaciones',
    ongoingChats: 'chats en curso',
    typeMessage: 'Escribir un mensaje...',
    viewProfile: 'Ver perfil',
    topics: 'Temas',
    topicsCovered: 'temas cubiertos',
    markTopicsAsCovered: 'Haz clic en los temas discutidos para marcarlos como cubiertos:',
    startConversation: 'Inicia la conversación enviando un mensaje',
    noMessagesYet: 'Aún no hay mensajes',
    selectConversation: 'Selecciona una conversación para empezar a chatear',
    topicParenting: 'Filosofía de crianza',
    topicConception: 'Método de concepción',
    topicCustody: 'Ritmo semanal & Custodia',
    topicLiving: 'Situación de vivienda',
    topicLegal: 'Configuración legal',
    topicFinancial: 'Expectativas financieras',

    
    // Profile Edit
    backToProfile: 'Volver al perfil',
    updatePersonalInfo: 'Actualice su información personal y preferencias',
    complete: 'Completo',
    completeProfileForBetterMatches: 'Complete su perfil para mejores coincidencias',
    bio: 'Biografía',
    tellPeopleAboutYourself: 'Cuéntenos sobre usted...',
    aboutYou: 'Sobre usted',
    work: 'Trabajo',
    education: 'Educación',
    location: 'Ubicación',
    hometown: 'Ciudad natal',
    spokenLanguages: 'Idiomas',
    interests: 'Intereses',
    causesAndCommunities: 'Causas y Comunidades',
    coreValues: 'Valores fundamentales',
    moreAboutYou: 'Más sobre usted',
    height: 'Altura',
    weight: 'Peso',
    exercise: 'Ejercicio',
    drinking: 'Alcohol',
    smoking: 'Tabaco',
    cannabis: 'Cannabis',
    drugs: 'Drogas',
    diet: 'Dieta',
    vaccinated: 'Vacunado',
    bloodType: 'Grupo sanguíneo',
    eyeColour: 'Color de ojos',
    hairColour: 'Color de cabello',
    ethnicity: 'Etnia',
    sexuality: 'Sexualidad',
    relationshipStatus: 'Estado sentimental',
    householdSituation: 'Situación de vivienda',
    familySituation: 'Situación familiar',
    children: 'Hijos',
    pets: 'Mascotas',
    religion: 'Religión',
    politics: 'Política',
    starSign: 'Signo zodiacal',
    coParentingPreferences: 'Preferencias de coparentalidad',
    lookingFor: 'Busco',
    openTo: 'Abierto a',
    custodyPreference: 'Preferencia de custodia',
    custodyModel: 'Modelo de custodia',
    conceptionMethod: 'Método de concepción',
    openToRelocation: 'Abierto a mudarse',
    parentingPhilosophy: 'Filosofía de crianza',
    financialSituation: 'Situación financiera',
    lifestyleRhythm: 'Ritmo de vida',
    addLanguagesYouSpeak: 'Agregue los idiomas que habla',
    addYourInterests: 'Agregue sus intereses',
    addCausesYouCareAbout: 'Agregue las causas que le importan',
    addValuesYouCareAbout: 'Agregue los valores que le importan',
    describeYourApproach: 'Describa su enfoque de crianza...',
    describeFinancialSituation: 'Describa su situación financiera...',
    describeDailyRhythm: 'Describa su ritmo diario y estilo de vida...',
    yes: 'Sí',
    no: 'No',
    child: 'hijo',
    selectUpTo: 'Seleccione hasta',
    selected: 'seleccionado(s)',
    duringSchool: 'Durante el período escolar',
    duringVacation: 'Durante las vacaciones',
    furtherInfo: 'Información adicional',
    searchForCity: 'Busque su ciudad...',
    searchForHometown: 'Busque su ciudad natal...',
    howTallAreYou: '¿Cuánto mide?',
    whatsYourWeight: '¿Cuánto pesa?',
    howOftenWorkout: '¿Con qué frecuencia hace ejercicio?',
    doYouDrink: '¿Bebe alcohol?',
    doYouSmoke: '¿Fuma?',
    doYouUseCannabis: '¿Consume cannabis?',
    doYouUseDrugs: '¿Consume drogas recreativas?',
    whatsYourDiet: '¿Cuál es su dieta?',
    vaccinationStatus: '¿Cuál es su estado de vacunación?',
    whatsYourBloodType: '¿Cuál es su grupo sanguíneo?',
    whatColourEyes: '¿De qué color son sus ojos?',
    whatColourHair: '¿De qué color es su cabello?',
    ethnicBackground: '¿Cuál es su origen étnico?',
    sexualOrientation: '¿Cuál es su orientación sexual?',
    currentStatus: '¿Cuál es su estado actual?',
    livingArrangement: '¿Cuál es su situación de vivienda actual?',
    relationshipWithFamily: '¿Cómo es su relación con padres y hermanos?',
    addChildrenDetails: 'Agregue sus hijos con detalles',
    doYouHavePets: '¿Tiene mascotas?',
    religiousBeliefs: '¿Cuáles son sus creencias religiosas?',
    politicalViews: '¿Cuáles son sus opiniones políticas?',
    zodiacSign: '¿Cuál es su signo zodiacal?',
    whatLanguagesDoYouKnow: '¿Qué idiomas conoce?',
    languagesHelperText: 'Esto se mostrará en su perfil y nos ayudará a conectarlo con personas que hablan sus idiomas.',
    selectUpToFive: 'Seleccione hasta 5',
    selectUpToThree: 'Seleccione hasta 3',
    howMuchTimeWithChild: '¿Cuánto tiempo desea pasar con su hijo?',
    preferredInvolvement: 'Participación preferida',
    approachesOpenTo: '¿Qué enfoques le interesan?',
    custodyArrangementPrefs: 'Defina sus preferencias de custodia',
    describeParentingPhilosophy: 'Cuéntenos sobre su filosofía de crianza, valores y enfoque para criar hijos...',
    describeFinancialApproach: 'Describa su situación financiera y su enfoque para compartir costos...',
    describeRoutine: 'Describa su día típico, rutina y ritmo de vida...',
    
    // Candidate Detail & Card
    candidateNotFound: 'Candidato no encontrado',
    goBack: 'Volver',
    backToDiscover: 'Volver a Descubrir',
    match: 'coincidencia',
    message: 'Mensaje',
    aboutMe: 'Sobre mí',
    about: 'Sobre',
    lifestyle: 'Estilo de vida',
    custodyPreferenceLabel: 'Preferencia de custodia',
    conceptionMethodLabel: 'Método de concepción',
    openToRelocationLabel: 'Abierto a mudarse',
    familySupport: 'Apoyo familiar',
    active: 'Activo',
    sometimes: 'A veces',
    rarely: 'Raramente',
    never: 'Nunca',
    socially: 'Socialmente',
    regularly: 'Regularmente',
    nonSmoker: 'No fumador',
    smoker: 'Fumador',
    formerSmoker: 'Exfumador',
    worksOutRegularly: 'Hace ejercicio regularmente',
    severalTimesWeek: 'Varias veces por semana',
    onceAWeek: 'Una vez por semana',
    occasionally: 'Ocasionalmente',
    almostNever: 'Casi nunca',
    doesntDrink: 'No bebe alcohol',
    onSpecialOccasions: 'En ocasiones especiales',
    whenWithFriends: 'Con amigos',
    mostWeekends: 'La mayoría de los fines de semana',
    naturalConception: 'Concepción natural',
    assistedReproduction: 'Reproducción asistida (FIV, IUI, etc.)',
    openToBoth: 'Abierto a ambos',
    
    // Conversation Detail & Flow
    conversationNotFound: 'Conversación no encontrada',
    stepsCompleted: 'pasos completados',
    conversationResponses: 'Respuestas de la conversación',
    waitingForResponse: 'Esperando la próxima respuesta...',
    notAFit: 'No es compatible',
    interested: 'Interesado',
    bothInterested: '¡Ambas partes están interesadas!',
    arrangeAMeeting: 'Es hora de organizar una reunión y continuar la conversación.',
    stepOf: 'Paso',
    continueBtn: 'Continuar',
    completeBtn: 'Completar',
    conversationComplete: '¡Conversación completada!',
    responsesHaveBeenSaved: 'Sus respuestas han sido guardadas.',
    willBeNotified: 'será notificado.',
    yourResponses: 'Sus respuestas',
    notAnswered: 'Sin responder',
    viewAllConversations: 'Ver todas las conversaciones',
    
    // Preview
    profilePreview: 'Vista previa del perfil',
    seeHowSeekersView: 'Vea cómo los buscadores ven su perfil',
    cardView: 'Vista de tarjeta',
    detailView: 'Vista detallada',
    view: 'Ver',
    vision: 'Visión',
    completeProfileToImprove: 'Complete su perfil para mejorar su visibilidad ante los buscadores',
    
    // Not Found
    pageNotFound: '404',
    oopsPageNotFound: '¡Ups! Página no encontrada',
    returnToHome: 'Volver al inicio',
    
    // Desktop Footer
    product: 'Producto',
    company: 'Empresa',
    legal: 'Legal',
    howItWorks: 'Cómo funciona',
    pricing: 'Precios',
    aboutUs: 'Sobre nosotros',
    blog: 'Blog',
    careers: 'Carreras',
    contact: 'Contacto',
    cookiePolicy: 'Política de cookies',
    allRightsReserved: 'Todos los derechos reservados.',
    findYourCoParent: 'Encuentra tu compañero de coparentalidad ideal con Kindly.',
    
    // Children Manager
    noChildrenAdded: 'No hay hijos agregados',
    addChild: 'Agregar hijo',
    addAnotherChild: 'Agregar otro hijo',
    gender: 'Género',
    boy: 'Niño',
    girl: 'Niña',
    other: 'Otro',
    birthdate: 'Fecha de nacimiento',
    custody: 'Custodia',
    yearsOld: 'años',
    
    // City Search
    searching: 'Buscando...',
    noCitiesFound: 'No se encontraron ciudades',
    findYourCity: 'Encuentra tu ciudad',
    
    // Resource Detail
    backToResources: 'Volver a Recursos',
    sectionsLabel: 'secciones',
    resourceNotFound: 'Recurso no encontrado',
    connectWithProfessionals: 'Conéctese con profesionales verificados que pueden ayudarle en su viaje de coparentalidad.',
    minRead: 'min de lectura',
    
    // Resource Content - Legal Framework
    legalFrameworkSubtitle: 'Entendiendo las leyes suizas de coparentalidad y acuerdos de custodia',
    legalSection1Title: 'Resumen del Derecho de Familia Suizo',
    legalSection1Content: 'El derecho de familia suizo proporciona un marco integral para los acuerdos de coparentalidad. El Código Civil (Zivilgesetzbuch) rige asuntos relacionados con la autoridad parental, la custodia y la manutención infantil. Reformas recientes han enfatizado la importancia de que ambos padres mantengan roles activos en la vida de sus hijos.',
    legalSection2Title: 'Acuerdos de Custodia Compartida',
    legalSection2Content: 'Desde 2014, la custodia compartida es el arreglo predeterminado en Suiza, a menos que sea contrario al interés superior del niño. Esto significa que ambos padres comparten las responsabilidades de toma de decisiones para aspectos importantes de la vida del niño, incluyendo educación, atención médica y crianza religiosa.',
    legalSection3Title: 'Establecimiento de Paternidad',
    legalSection3Content: 'Para padres no casados, la paternidad debe establecerse legalmente ya sea mediante el reconocimiento del padre o mediante procedimientos judiciales. Este paso es crucial para establecer los derechos y responsabilidades legales de ambos padres.',
    legalSection4Title: 'Responsabilidades Financieras',
    legalSection4Content: 'Ambos padres están legalmente obligados a contribuir al apoyo financiero de su hijo. Los cálculos de manutención consideran los ingresos de ambos padres, las necesidades del niño y la cantidad de tiempo que pasa con cada padre.',
    
    // Resource Content - Agreement Templates
    agreementTemplatesSubtitle: 'Ejemplos de acuerdos y contratos de coparentalidad',
    agreementSection1Title: 'Por qué los Acuerdos Escritos son Importantes',
    agreementSection1Content: 'Un acuerdo de coparentalidad escrito ayuda a prevenir malentendidos y proporciona una referencia clara para ambas partes. Aunque los acuerdos verbales pueden funcionar, tener documentación protege los intereses de todos.',
    agreementSection2Title: 'Componentes Clave a Incluir',
    agreementSection2Content: 'Su acuerdo debe cubrir: calendario de custodia, responsabilidades de toma de decisiones, contribuciones financieras, protocolos de comunicación, métodos de resolución de disputas y disposiciones para modificaciones futuras.',
    agreementSection3Title: 'Revisión Legal',
    agreementSection3Content: 'Recomendamos encarecidamente que cualquier acuerdo de coparentalidad sea revisado por un abogado de derecho familiar antes de firmarlo. Esto asegura que el acuerdo sea ejecutable y proteja los derechos de ambas partes.',
    
    // Resource Content - Community Stories
    communityStoriesSubtitle: 'Experiencias reales de asociaciones de coparentalidad exitosas',
    communitySection1Title: 'María y Thomas - Zúrich',
    communitySection1Content: '"Nos conocimos a través de Kindly hace dos años y ahora tenemos una hermosa hija juntos. La clave de nuestro éxito ha sido la comunicación clara y el respeto mutuo. Programamos revisiones regulares para discutir decisiones de crianza y siempre pusimos las necesidades de nuestra hija primero."',
    communitySection2Title: 'Sophie y Jan - Basilea',
    communitySection2Content: '"Como mujer soltera a finales de mis 30, pensé que mi sueño de ser madre se estaba desvaneciendo. Encontrar a Jan a través de esta plataforma lo cambió todo. Nos tomamos el tiempo para conocernos, nos reunimos con un consejero juntos y creamos un plan parental detallado antes de continuar."',
    communitySection3Title: 'Consejos de Nuestra Comunidad',
    communitySection3Content: 'Consejos comunes de copadres exitosos: tómese el tiempo para conocer realmente a su potencial copadre, sea honesto sobre sus expectativas, busque orientación profesional y recuerde que la flexibilidad y la paciencia son esenciales.',
    
    // Resource Content - Relationship Guidance
    relationshipGuidanceSubtitle: 'Construyendo una asociación de coparentalidad saludable',
    relationshipSection1Title: 'La Comunicación es Clave',
    relationshipSection1Content: 'Las relaciones de coparentalidad exitosas se construyen sobre una comunicación abierta y honesta. Establezca métodos de comunicación preferidos desde el principio y comprométase a revisiones regulares sobre el bienestar y desarrollo de su hijo.',
    relationshipSection2Title: 'Estableciendo Límites',
    relationshipSection2Content: 'Los límites claros ayudan a mantener una relación de coparentalidad saludable. Discuta y acuerde expectativas sobre el espacio personal, las relaciones románticas, las decisiones de crianza y la participación de la familia extendida.',
    relationshipSection3Title: 'Resolución de Conflictos',
    relationshipSection3Content: 'Los desacuerdos son normales en cualquier relación. Desarrolle estrategias para manejar los conflictos de manera constructiva, como tomarse tiempo para calmarse, usar declaraciones en "yo" y enfocarse en soluciones en lugar de culpas.',
    
    // Resource Content - Planning Tools
    planningToolsSubtitle: 'Programación, presupuestos y listas de verificación logística',
    planningSection1Title: 'Planificación del Calendario de Custodia',
    planningSection1Content: 'Considere varias opciones de horario: semanas alternas, rotación 2-2-3 u otros arreglos que funcionen para su situación. Use calendarios compartidos para rastrear tiempo de custodia, citas y actividades.',
    planningSection2Title: 'Lista de Verificación de Planificación Financiera',
    planningSection2Content: 'Consideraciones financieras clave: gastos médicos y seguro, costos de cuidado infantil, fondos de educación, ropa y esenciales, actividades extracurriculares y fondos de emergencia.',
    planningSection3Title: 'Coordinación Logística',
    planningSection3Content: 'Asuntos prácticos a abordar: lugares y horarios de intercambio, responsabilidades de transporte, comunicación sobre rutinas diarias, manejo de vacaciones y ocasiones especiales, y protocolos de contacto de emergencia.',
    
    // Resource Content - Reading List
    readingListSubtitle: 'Libros recomendados sobre estructuras familiares modernas',
    readingSection1Title: 'Lectura Esencial',
    readingSection1Content: '"Co-Parenting 101" de Deesha Philyaw - Una guía práctica para navegar la crianza compartida. "The Co-Parents\' Handbook" de Karen Bonnell - Estrategias para una colaboración efectiva. "Modern Families" de Joshua Gamson - Explorando estructuras familiares diversas.',
    readingSection2Title: 'Para Niños',
    readingSection2Content: 'Libros apropiados para la edad para ayudar a los niños a entender su estructura familiar: "Dos Hogares" de Claire Masurel, "La Casa de Mamá, La Casa de Papá para Niños" de Isolina Ricci y "De Pie Sobre Mis Propios Dos Pies" de Tamara Schmitz.',
    readingSection3Title: 'Recursos Legales y Financieros',
    readingSection3Content: '"La Guía Completa de Acuerdos de Custodia" - Entendiendo sus opciones legales. "Dinero y Familia" de Liz Frazier - Planificación financiera para familias modernas.',
  },
  it: {
    // Navigation
    discover: 'Scopri',
    resources: 'Risorse',
    chats: 'Messaggi',
    profile: 'Profilo',
    settings: 'Impostazioni',
    logout: 'Esci',
    preview: 'Anteprima',
    requests: 'Richieste',
    myProfile: 'Il mio Profilo',
    
    // Common
    filters: 'Filtri',
    save: 'Salva',
    cancel: 'Annulla',
    edit: 'Modifica',
    delete: 'Elimina',
    back: 'Indietro',
    next: 'Avanti',
    submit: 'Invia',
    loading: 'Caricamento...',
    
    // Discover
    potentialCoParents: 'co-genitori potenziali corrispondono ai tuoi criteri',
    noMatches: 'Nessun candidato corrisponde ai tuoi filtri.',
    adjustFilters: 'Modifica filtri',
    
    // Profile
    manageAccount: 'Gestisci il tuo account',
    editProfile: 'Modifica profilo',
    profileComplete: 'Profilo completo',
    viewsThisWeek: 'Visite questa settimana',
    accountSettings: 'Impostazioni account',
    appMode: 'Uso Kindly come',
    seekerLabel: 'Cercatore/trice',
    candidateLabel: 'Candidato/a',
    shortlist: 'Lista preferiti',
    savedProfiles: 'Visualizza i profili salvati',
    safetyPrivacy: 'Sicurezza e Privacy',
    privacySettings: 'Gestisci le impostazioni sulla privacy',
    plansSubscription: 'Piani e Abbonamento',
    manageSubscription: 'Gestisci il tuo abbonamento',
    notifications: 'Notifiche',
    notificationPreferences: 'Gestisci le preferenze di notifica',
    accountSecurity: 'Sicurezza account',
    securitySettings: 'Password e sicurezza',
    appSettings: 'Impostazioni dell\'app',
    
    // Settings
    preferences: 'Preferenze',
    language: 'Lingua',
    darkMode: 'Modalità scura',
    darkModeDesc: 'Passa tra tema chiaro e scuro',
    soundEffects: 'Effetti sonori',
    soundEffectsDesc: 'Abilita i suoni dell\'app',
    communication: 'Comunicazione',
    pushNotifications: 'Notifiche push',
    pushNotificationsDesc: 'Gestisci le notifiche push',
    emailPreferences: 'Preferenze email',
    emailPreferencesDesc: 'Newsletter e notifiche email',
    support: 'Supporto',
    helpCenter: 'Centro assistenza',
    helpCenterDesc: 'FAQ e articoli di supporto',
    termsOfService: 'Termini di servizio',
    termsOfServiceDesc: 'Leggi i nostri termini e condizioni',
    privacyPolicy: 'Informativa sulla privacy',
    privacyPolicyDesc: 'Come gestiamo i tuoi dati',
    aboutApp: 'Informazioni su Kindly',
    
    // Safety & Privacy
    profileVisibility: 'Visibilità del profilo',
    profileVisibilityDesc: 'Rendi il tuo profilo visibile agli altri',
    showOnlineStatus: 'Mostra stato online',
    showOnlineStatusDesc: 'Permetti agli altri di vedere quando sei online',
    showLocation: 'Mostra posizione',
    showLocationDesc: 'Mostra la tua città sul profilo',
    showLastActive: 'Mostra ultima attività',
    showLastActiveDesc: 'Mostra quando eri attivo l\'ultima volta',
    blockedUsers: 'Utenti bloccati',
    blockedUsersDesc: 'Gestisci i profili bloccati',
    reportHistory: 'Cronologia segnalazioni',
    reportHistoryDesc: 'Visualizza le segnalazioni inviate',
    safetyPriority: 'La tua sicurezza è la nostra priorità',
    safetyPriorityDesc: 'Tutte le conversazioni sono monitorate. Segnala qualsiasi preoccupazione e il nostro team esaminerà entro 24 ore.',
    
    // Notifications
    newMessages: 'Nuovi messaggi',
    newMessagesDesc: 'Ricevi notifica per nuovi messaggi',
    newMatches: 'Nuove corrispondenze',
    newMatchesDesc: 'Qualcuno ti ha aggiunto alla lista',
    profileViews: 'Visualizzazioni profilo',
    profileViewsDesc: 'Qualcuno ha visualizzato il tuo profilo',
    reminders: 'Promemoria',
    remindersDesc: 'Promemoria attività e suggerimenti',
    weeklyDigest: 'Riepilogo settimanale',
    weeklyDigestDesc: 'Riepilogo della tua attività settimanale',
    marketingEmails: 'Email di marketing',
    marketingEmailsDesc: 'Notizie, suggerimenti e offerte speciali',
    
    // Account Security
    changePassword: 'Cambia password',
    changePasswordDesc: 'Aggiorna la password dell\'account',
    changeEmail: 'Cambia email',
    changeEmailDesc: 'Aggiorna l\'indirizzo email',
    twoFactorAuth: 'Autenticazione a due fattori',
    twoFactorAuthDesc: 'Aggiungi un livello di sicurezza extra',
    loginHistory: 'Cronologia accessi',
    loginHistoryDesc: 'Visualizza la tua attività di accesso recente',
    activeSessions: 'Sessioni attive',
    activeSessionsDesc: 'Gestisci i dispositivi connessi',
    dangerZone: 'Zona pericolosa',
    deleteAccount: 'Elimina account',
    deleteAccountDesc: 'Elimina permanentemente account e dati',
    newPassword: 'Nuova password',
    confirmPassword: 'Conferma password',
    updatePassword: 'Aggiorna password',
    newEmail: 'Nuova email',
    updateEmail: 'Aggiorna email',
    lastSignInLabel: 'Ultimo accesso',
    thisDevice: 'Questo dispositivo',
    signOutHere: 'Esci',
    deleteAccountConfirm: 'Il tuo account e i tuoi dati saranno eliminati permanentemente. Verrai disconnesso. Questa azione non può essere annullata.',
    deleteAccountSuccess: 'Il tuo account è stato eliminato.',
    twoFactorComingSoon: 'Prossimamente',

    // Resources
    learnAboutCoParenting: 'Scopri la co-genitorialità',
    everythingYouNeed: 'Tutto ciò che devi sapere sulla co-genitorialità',
    legalFramework: 'Quadro giuridico',
    legalFrameworkDesc: 'Comprendere le leggi svizzere sulla co-genitorialità',
    agreementTemplates: 'Modelli di accordo',
    agreementTemplatesDesc: 'Esempi di accordi e contratti di co-genitorialità',
    communityStories: 'Storie della comunità',
    communityStoriesDesc: 'Esperienze reali di co-genitorialità di successo',
    relationshipGuidance: 'Guida relazionale',
    relationshipGuidanceDesc: 'Costruire una partnership di co-genitorialità sana',
    planningTools: 'Strumenti di pianificazione',
    planningToolsDesc: 'Programmazione, budget e checklist logistiche',
    readingList: 'Lista di lettura',
    readingListDesc: 'Libri consigliati sulle strutture familiari moderne',
    needMoreGuidance: 'Hai bisogno di più assistenza?',
    findProfessional: 'Trova un professionista',
    
    // Conversations
    conversations: 'Conversazioni',
    ongoingChats: 'chat in corso',
    typeMessage: 'Scrivi un messaggio...',
    viewProfile: 'Visualizza profilo',
    topics: 'Argomenti',
    topicsCovered: 'argomenti coperti',
    markTopicsAsCovered: 'Clicca sugli argomenti discussi per segnarli come coperti:',
    startConversation: 'Inizia la conversazione inviando un messaggio',
    noMessagesYet: 'Nessun messaggio ancora',
    selectConversation: 'Seleziona una conversazione per iniziare a chattare',
    topicParenting: 'Filosofia genitoriale',
    topicConception: 'Metodo di concepimento',
    topicCustody: 'Ritmo settimanale & Custodia',
    topicLiving: 'Situazione abitativa',
    topicLegal: 'Configurazione legale',
    topicFinancial: 'Aspettative finanziarie',

    
    // Profile Edit
    backToProfile: 'Torna al profilo',
    updatePersonalInfo: 'Aggiorna le tue informazioni personali e preferenze',
    complete: 'Completo',
    completeProfileForBetterMatches: 'Completa il tuo profilo per match migliori',
    bio: 'Bio',
    tellPeopleAboutYourself: 'Raccontaci di te...',
    aboutYou: 'Su di te',
    work: 'Lavoro',
    education: 'Istruzione',
    location: 'Posizione',
    hometown: 'Città natale',
    spokenLanguages: 'Lingue',
    interests: 'Interessi',
    causesAndCommunities: 'Cause e Comunità',
    coreValues: 'Valori fondamentali',
    moreAboutYou: 'Altro su di te',
    height: 'Altezza',
    weight: 'Peso',
    exercise: 'Esercizio',
    drinking: 'Alcol',
    smoking: 'Fumo',
    cannabis: 'Cannabis',
    drugs: 'Droghe',
    diet: 'Dieta',
    vaccinated: 'Vaccinato',
    bloodType: 'Gruppo sanguigno',
    eyeColour: 'Colore degli occhi',
    hairColour: 'Colore dei capelli',
    ethnicity: 'Etnia',
    sexuality: 'Sessualità',
    relationshipStatus: 'Stato sentimentale',
    householdSituation: 'Situazione abitativa',
    familySituation: 'Situazione familiare',
    children: 'Figli',
    pets: 'Animali',
    religion: 'Religione',
    politics: 'Politica',
    starSign: 'Segno zodiacale',
    coParentingPreferences: 'Preferenze di co-genitorialità',
    lookingFor: 'Cerco',
    openTo: 'Aperto a',
    custodyPreference: 'Preferenza di affidamento',
    custodyModel: 'Modello di affidamento',
    conceptionMethod: 'Metodo di concepimento',
    openToRelocation: 'Aperto a trasferirsi',
    parentingPhilosophy: 'Filosofia genitoriale',
    financialSituation: 'Situazione finanziaria',
    lifestyleRhythm: 'Ritmo di vita',
    addLanguagesYouSpeak: 'Aggiungi le lingue che parli',
    addYourInterests: 'Aggiungi i tuoi interessi',
    addCausesYouCareAbout: 'Aggiungi le cause che ti stanno a cuore',
    addValuesYouCareAbout: 'Aggiungi i valori che ti stanno a cuore',
    describeYourApproach: 'Descrivi il tuo approccio genitoriale...',
    describeFinancialSituation: 'Descrivi la tua situazione finanziaria...',
    describeDailyRhythm: 'Descrivi il tuo ritmo quotidiano e stile di vita...',
    yes: 'Sì',
    no: 'No',
    child: 'figlio',
    selectUpTo: 'Seleziona fino a',
    selected: 'selezionato/i',
    duringSchool: 'Durante la scuola',
    duringVacation: 'Durante le vacanze',
    furtherInfo: 'Ulteriori informazioni',
    searchForCity: 'Cerca la tua città...',
    searchForHometown: 'Cerca la tua città natale...',
    howTallAreYou: 'Quanto sei alto?',
    whatsYourWeight: 'Quanto pesi?',
    howOftenWorkout: 'Quanto spesso fai esercizio?',
    doYouDrink: 'Bevi alcol?',
    doYouSmoke: 'Fumi?',
    doYouUseCannabis: 'Fai uso di cannabis?',
    doYouUseDrugs: 'Fai uso di droghe ricreative?',
    whatsYourDiet: 'Qual è la tua dieta?',
    vaccinationStatus: 'Qual è il tuo stato vaccinale?',
    whatsYourBloodType: 'Qual è il tuo gruppo sanguigno?',
    whatColourEyes: 'Di che colore sono i tuoi occhi?',
    whatColourHair: 'Di che colore sono i tuoi capelli?',
    ethnicBackground: 'Qual è la tua origine etnica?',
    sexualOrientation: 'Qual è il tuo orientamento sessuale?',
    currentStatus: 'Qual è il tuo stato attuale?',
    livingArrangement: 'Qual è la tua attuale situazione abitativa?',
    relationshipWithFamily: 'Com\'è il tuo rapporto con genitori e fratelli?',
    addChildrenDetails: 'Aggiungi i tuoi figli con i dettagli',
    doYouHavePets: 'Hai animali domestici?',
    religiousBeliefs: 'Quali sono le tue credenze religiose?',
    politicalViews: 'Quali sono le tue opinioni politiche?',
    zodiacSign: 'Qual è il tuo segno zodiacale?',
    whatLanguagesDoYouKnow: 'Quali lingue conosci?',
    languagesHelperText: 'Queste informazioni verranno mostrate sul tuo profilo e ci aiuteranno a connetterti con persone che parlano le tue lingue.',
    selectUpToFive: 'Seleziona fino a 5',
    selectUpToThree: 'Seleziona fino a 3',
    howMuchTimeWithChild: 'Quanto tempo vorresti trascorrere con tuo figlio?',
    preferredInvolvement: 'Coinvolgimento preferito',
    approachesOpenTo: 'Quali approcci ti interessano?',
    custodyArrangementPrefs: 'Definisci le tue preferenze di affidamento',
    describeParentingPhilosophy: 'Raccontaci della tua filosofia genitoriale, valori e approccio alla crescita dei figli...',
    describeFinancialApproach: 'Descrivi la tua situazione finanziaria e il tuo approccio alla condivisione dei costi...',
    describeRoutine: 'Descrivi la tua giornata tipo, routine e ritmo di vita...',
    
    // Candidate Detail & Card
    candidateNotFound: 'Candidato non trovato',
    goBack: 'Torna indietro',
    backToDiscover: 'Torna a Scopri',
    match: 'corrispondenza',
    message: 'Messaggio',
    aboutMe: 'Su di me',
    about: 'Informazioni',
    lifestyle: 'Stile di vita',
    custodyPreferenceLabel: 'Preferenza di affidamento',
    conceptionMethodLabel: 'Metodo di concepimento',
    openToRelocationLabel: 'Aperto a trasferirsi',
    familySupport: 'Supporto familiare',
    active: 'Attivo',
    sometimes: 'A volte',
    rarely: 'Raramente',
    never: 'Mai',
    socially: 'In società',
    regularly: 'Regolarmente',
    nonSmoker: 'Non fumatore',
    smoker: 'Fumatore',
    formerSmoker: 'Ex fumatore',
    worksOutRegularly: 'Si allena regolarmente',
    severalTimesWeek: 'Diverse volte a settimana',
    onceAWeek: 'Una volta a settimana',
    occasionally: 'Occasionalmente',
    almostNever: 'Quasi mai',
    doesntDrink: 'Non beve alcol',
    onSpecialOccasions: 'In occasioni speciali',
    whenWithFriends: 'Con gli amici',
    mostWeekends: 'La maggior parte dei fine settimana',
    naturalConception: 'Concepimento naturale',
    assistedReproduction: 'Riproduzione assistita (FIV, IUI, ecc.)',
    openToBoth: 'Aperto a entrambi',
    
    // Conversation Detail & Flow
    conversationNotFound: 'Conversazione non trovata',
    stepsCompleted: 'passaggi completati',
    conversationResponses: 'Risposte della conversazione',
    waitingForResponse: 'In attesa della prossima risposta...',
    notAFit: 'Non compatibile',
    interested: 'Interessato',
    bothInterested: 'Entrambe le parti sono interessate!',
    arrangeAMeeting: 'È il momento di organizzare un incontro e continuare la conversazione.',
    stepOf: 'Passaggio',
    continueBtn: 'Continua',
    completeBtn: 'Completa',
    conversationComplete: 'Conversazione completata!',
    responsesHaveBeenSaved: 'Le tue risposte sono state salvate.',
    willBeNotified: 'sarà notificato.',
    yourResponses: 'Le tue risposte',
    notAnswered: 'Non risposto',
    viewAllConversations: 'Vedi tutte le conversazioni',
    
    // Preview
    profilePreview: 'Anteprima del profilo',
    seeHowSeekersView: 'Vedi come i cercatori vedono il tuo profilo',
    cardView: 'Vista scheda',
    detailView: 'Vista dettagliata',
    view: 'Visualizza',
    vision: 'Visione',
    completeProfileToImprove: 'Completa il tuo profilo per migliorare la tua visibilità ai cercatori',
    
    // Not Found
    pageNotFound: '404',
    oopsPageNotFound: 'Ops! Pagina non trovata',
    returnToHome: 'Torna alla Home',
    
    // Desktop Footer
    product: 'Prodotto',
    company: 'Azienda',
    legal: 'Legale',
    howItWorks: 'Come funziona',
    pricing: 'Prezzi',
    aboutUs: 'Chi siamo',
    blog: 'Blog',
    careers: 'Carriere',
    contact: 'Contatto',
    cookiePolicy: 'Cookie Policy',
    allRightsReserved: 'Tutti i diritti riservati.',
    findYourCoParent: 'Trova il tuo partner ideale per la co-genitorialità con Kindly.',
    
    // Children Manager
    noChildrenAdded: 'Nessun figlio aggiunto',
    addChild: 'Aggiungi figlio',
    addAnotherChild: 'Aggiungi un altro figlio',
    gender: 'Genere',
    boy: 'Maschio',
    girl: 'Femmina',
    other: 'Altro',
    birthdate: 'Data di nascita',
    custody: 'Affidamento',
    yearsOld: 'anni',
    
    // City Search
    searching: 'Ricerca...',
    noCitiesFound: 'Nessuna città trovata',
    findYourCity: 'Trova la tua città',
    
    // Resource Detail
    backToResources: 'Torna alle Risorse',
    sectionsLabel: 'sezioni',
    resourceNotFound: 'Risorsa non trovata',
    connectWithProfessionals: 'Connettiti con professionisti verificati che possono aiutarti nel tuo percorso di co-genitorialità.',
    minRead: 'min di lettura',
    
    // Resource Content - Legal Framework
    legalFrameworkSubtitle: 'Comprendere le leggi svizzere sulla co-genitorialità e gli accordi di custodia',
    legalSection1Title: 'Panoramica del Diritto di Famiglia Svizzero',
    legalSection1Content: 'Il diritto di famiglia svizzero fornisce un quadro completo per gli accordi di co-genitorialità. Il Codice Civile (Zivilgesetzbuch) regola le questioni relative all\'autorità genitoriale, alla custodia e al mantenimento dei figli. Recenti riforme hanno sottolineato l\'importanza che entrambi i genitori mantengano ruoli attivi nella vita dei loro figli.',
    legalSection2Title: 'Accordi di Custodia Congiunta',
    legalSection2Content: 'Dal 2014, la custodia congiunta è l\'accordo predefinito in Svizzera, a meno che non sia contrario all\'interesse superiore del bambino. Ciò significa che entrambi i genitori condividono le responsabilità decisionali per gli aspetti principali della vita del bambino, inclusi istruzione, assistenza sanitaria e educazione religiosa.',
    legalSection3Title: 'Stabilire la Paternità',
    legalSection3Content: 'Per i genitori non sposati, la paternità deve essere legalmente stabilita sia attraverso il riconoscimento del padre che attraverso procedimenti giudiziari. Questo passaggio è cruciale per stabilire i diritti e le responsabilità legali di entrambi i genitori.',
    legalSection4Title: 'Responsabilità Finanziarie',
    legalSection4Content: 'Entrambi i genitori sono legalmente tenuti a contribuire al sostegno finanziario del loro figlio. I calcoli del mantenimento considerano il reddito di entrambi i genitori, le esigenze del bambino e il tempo trascorso con ciascun genitore.',
    
    // Resource Content - Agreement Templates
    agreementTemplatesSubtitle: 'Esempi di accordi e contratti di co-genitorialità',
    agreementSection1Title: 'Perché gli Accordi Scritti Sono Importanti',
    agreementSection1Content: 'Un accordo di co-genitorialità scritto aiuta a prevenire malintesi e fornisce un riferimento chiaro per entrambe le parti. Mentre gli accordi verbali possono funzionare, avere una documentazione protegge gli interessi di tutti.',
    agreementSection2Title: 'Componenti Chiave da Includere',
    agreementSection2Content: 'Il vostro accordo dovrebbe coprire: calendario di custodia, responsabilità decisionali, contributi finanziari, protocolli di comunicazione, metodi di risoluzione delle controversie e disposizioni per modifiche future.',
    agreementSection3Title: 'Revisione Legale',
    agreementSection3Content: 'Raccomandiamo vivamente di far revisionare qualsiasi accordo di co-genitorialità da un avvocato di diritto di famiglia prima di firmare. Questo garantisce che l\'accordo sia esecutivo e protegga i diritti di entrambe le parti.',
    
    // Resource Content - Community Stories
    communityStoriesSubtitle: 'Esperienze reali di partnership di co-genitorialità di successo',
    communitySection1Title: 'Maria e Thomas - Zurigo',
    communitySection1Content: '"Ci siamo conosciuti tramite Kindly due anni fa e ora abbiamo una bellissima figlia insieme. La chiave del nostro successo è stata una comunicazione chiara e il rispetto reciproco. Abbiamo programmato incontri regolari per discutere le decisioni genitoriali e abbiamo sempre messo le esigenze di nostra figlia al primo posto."',
    communitySection2Title: 'Sophie e Jan - Basilea',
    communitySection2Content: '"Come donna single alla fine dei miei 30 anni, pensavo che il mio sogno di diventare madre stesse svanendo. Trovare Jan attraverso questa piattaforma ha cambiato tutto. Ci siamo presi il tempo per conoscerci, abbiamo incontrato un consulente insieme e abbiamo creato un piano genitoriale dettagliato prima di procedere."',
    communitySection3Title: 'Consigli dalla Nostra Comunità',
    communitySection3Content: 'Consigli comuni da co-genitori di successo: prendetevi il tempo per conoscere davvero il vostro potenziale co-genitore, siate onesti sulle vostre aspettative, cercate una guida professionale e ricordate che flessibilità e pazienza sono essenziali.',
    
    // Resource Content - Relationship Guidance
    relationshipGuidanceSubtitle: 'Costruire una partnership di co-genitorialità sana',
    relationshipSection1Title: 'La Comunicazione è Fondamentale',
    relationshipSection1Content: 'Le relazioni di co-genitorialità di successo sono costruite su una comunicazione aperta e onesta. Stabilite presto i metodi di comunicazione preferiti e impegnatevi in verifiche regolari sul benessere e lo sviluppo del vostro bambino.',
    relationshipSection2Title: 'Stabilire i Limiti',
    relationshipSection2Content: 'Limiti chiari aiutano a mantenere una relazione di co-genitorialità sana. Discutete e concordate le aspettative riguardo allo spazio personale, alle relazioni romantiche, alle decisioni genitoriali e al coinvolgimento della famiglia allargata.',
    relationshipSection3Title: 'Risoluzione dei Conflitti',
    relationshipSection3Content: 'I disaccordi sono normali in qualsiasi relazione. Sviluppate strategie per gestire i conflitti in modo costruttivo, come prendersi tempo per calmarsi, usare affermazioni in "io" e concentrarsi sulle soluzioni piuttosto che sulle colpe.',
    
    // Resource Content - Planning Tools
    planningToolsSubtitle: 'Programmazione, budgeting e checklist logistiche',
    planningSection1Title: 'Pianificazione del Calendario di Custodia',
    planningSection1Content: 'Considerate varie opzioni di programma: settimane alternate, rotazione 2-2-3 o altri accordi che funzionano per la vostra situazione. Usate calendari condivisi per tenere traccia del tempo di custodia, appuntamenti e attività.',
    planningSection2Title: 'Checklist di Pianificazione Finanziaria',
    planningSection2Content: 'Considerazioni finanziarie chiave: spese mediche e assicurazione, costi di assistenza all\'infanzia, fondi per l\'istruzione, abbigliamento e beni essenziali, attività extracurriculari e fondi di emergenza.',
    planningSection3Title: 'Coordinamento Logistico',
    planningSection3Content: 'Questioni pratiche da affrontare: luoghi e orari di scambio, responsabilità di trasporto, comunicazione sulle routine quotidiane, gestione delle vacanze e occasioni speciali e protocolli di contatto di emergenza.',
    
    // Resource Content - Reading List
    readingListSubtitle: 'Libri consigliati sulle strutture familiari moderne',
    readingSection1Title: 'Letture Essenziali',
    readingSection1Content: '"Co-Parenting 101" di Deesha Philyaw - Una guida pratica per navigare la genitorialità condivisa. "The Co-Parents\' Handbook" di Karen Bonnell - Strategie per una collaborazione efficace. "Modern Families" di Joshua Gamson - Esplorare diverse strutture familiari.',
    readingSection2Title: 'Per i Bambini',
    readingSection2Content: 'Libri adatti all\'età per aiutare i bambini a capire la loro struttura familiare: "Due Case" di Claire Masurel, "La Casa di Mamma, La Casa di Papà per Bambini" di Isolina Ricci e "In Piedi Sui Miei Due Piedi" di Tamara Schmitz.',
    readingSection3Title: 'Risorse Legali e Finanziarie',
    readingSection3Content: '"La Guida Completa agli Accordi di Custodia" - Capire le vostre opzioni legali. "Soldi e Famiglia" di Liz Frazier - Pianificazione finanziaria per le famiglie moderne.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved && saved !== language) {
      setLanguageState(saved as Language);
    }
  }, []);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
