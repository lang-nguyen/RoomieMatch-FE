import { useEffect, useMemo, useState } from 'react';
import { MATCHING_STEPS } from '../models/matchingModels';
import { matchingRepositoryMock } from '../repositories/matchingRepositoryMock';

export const useMatchingFlow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(MATCHING_STEPS.ONBOARDING);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [hasContactInfo, setHasContactInfo] = useState(false);
  const [currentUserContact, setCurrentUserContact] = useState(null);
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [skippedUsers, setSkippedUsers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [showContactCard, setShowContactCard] = useState(false);

  useEffect(() => {
    let isMounted = true;

    matchingRepositoryMock.getBootstrap().then((data) => {
      if (!isMounted) return;

      setHasProfile(data.hasProfile);
      setHasContactInfo(data.hasContactInfo);
      setCurrentUserContact(data.currentUserContact);
      setMatchingUsers(data.matchingUsers);
      setMatchHistory(data.matchHistory);
      setSkippedUsers(data.skippedUsers);
      setIsLoading(false);

      if (data.hasProfile && data.hasContactInfo) {
        setStep(MATCHING_STEPS.MATCHING);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeUser = useMemo(() => {
    if (!matchingUsers.length) return null;
    return matchingUsers[activeIndex] || null;
  }, [activeIndex, matchingUsers]);

  const completeProfile = async (profile) => {
    await matchingRepositoryMock.saveProfile(profile);
    setHasProfile(true);
    setShowProfileForm(false);

    if (hasContactInfo && step === MATCHING_STEPS.ONBOARDING) {
      setStep(MATCHING_STEPS.SUCCESS);
    }
  };

  const completeContactInfo = async (contactInfo) => {
    const saved = await matchingRepositoryMock.saveContactInfo(contactInfo);
    setHasContactInfo(true);
    setCurrentUserContact((previous) => ({
      ...(previous || {}),
      email: saved.contactInfo.email,
      phone: saved.contactInfo.phone,
      socials: saved.contactInfo.socials,
    }));
    setShowContactForm(false);

    if (hasProfile && step === MATCHING_STEPS.ONBOARDING) {
      setStep(MATCHING_STEPS.SUCCESS);
    }
  };

  const startMatching = () => {
    setStep(MATCHING_STEPS.MATCHING);
    setIsRevealed(false);
    setShowContactCard(false);
  };

  const revealCard = () => {
    if (isRevealed || isFlipping) return;

    setIsFlipping(true);
    window.setTimeout(() => {
      setIsRevealed(true);
      setIsFlipping(false);
    }, 520);
  };

  const skipActiveUser = () => {
    if (!activeUser || isSkipping) return;

    const skippedUser = activeUser;
    setIsSkipping(true);
    setShowContactCard(false);
    matchingRepositoryMock.skipUser(skippedUser);

    window.setTimeout(() => {
      setSkippedUsers((previous) => {
        if (previous.some((user) => user.id === skippedUser.id)) return previous;
        return [
          {
            id: skippedUser.id,
            name: skippedUser.name,
            area: skippedUser.area,
            avatar: skippedUser.avatar,
          },
          ...previous,
        ];
      });
      setActiveIndex((index) => index + 1);
      setIsSkipping(false);
      setIsRevealed(true);
    }, 420);
  };

  return {
    isLoading,
    step,
    showProfileForm,
    showContactForm,
    hasProfile,
    hasContactInfo,
    currentUserContact,
    activeUser,
    matchHistory,
    skippedUsers,
    isRevealed,
    isFlipping,
    isSkipping,
    showContactCard,
    setShowProfileForm,
    setShowContactForm,
    setShowContactCard,
    completeProfile,
    completeContactInfo,
    startMatching,
    revealCard,
    skipActiveUser,
  };
};
