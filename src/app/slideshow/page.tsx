"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/contexts/AppContext";

interface Member {
  id: string;
  name: string;
  fatherName: string;
  houseName: string;
  housePriority: number;
  familyMembers: number;
  beefShare: number;
  lungsShare: number;
  boneShare: number;
}

export default function SlideshowPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useApp();

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const fetchAllMembers = async () => {
    try {
      const res = await fetch("/api/members?limit=1000");
      const data = await res.json();
      const sortedMembers = data.members.sort((a: Member, b: Member) => {
        if (a.housePriority !== b.housePriority) {
          return a.housePriority - b.housePriority;
        }
        return a.name.localeCompare(b.name);
      });
      setMembers(sortedMembers);
    } catch (error) {
      console.error("Failed to fetch members");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : members.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < members.length - 1 ? prev + 1 : 0));
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") handlePrevious();
    if (e.key === "ArrowRight" || e.key === "ArrowDown") handleNext();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-white dark:text-gray-300 text-2xl">{t("loading")}</div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center text-white dark:text-gray-300">
          <h2 className="text-3xl font-bold mb-4">No members found</h2>
          <Link href="/members">
            <Button variant="outline" className="text-white border-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Members
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentMember = members[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-black/20 backdrop-blur-sm">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("getStarted")}
          </Button>
        </Link>
        <div className="text-white text-sm font-medium">
          {currentIndex + 1} / {members.length}
        </div>
      </div>

      <div className="h-screen flex items-center justify-center px-4 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
              {currentMember.housePriority < 999 && (
                <div className="flex justify-center mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold">
                    <Home className="h-4 w-4" />
                    {t("housePriority")}: {currentMember.housePriority}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("name")}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentMember.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("fatherName")}</p>
                    <p className="text-xl text-gray-700 dark:text-gray-300">{currentMember.fatherName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("houseName")}</p>
                    <p className="text-xl text-gray-700 dark:text-gray-300">{currentMember.houseName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("familySize")}</p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {currentMember.familyMembers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 dark:border-gray-700 my-6"></div>

              <div>
                <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
                  {t("yourShare")}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 text-center border-2 border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-600 dark:text-red-400 uppercase font-semibold mb-1">
                      {t("beef")}
                    </p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                      {currentMember.beefShare.toFixed(0)}
                    </p>
                    <p className="text-xs text-red-500 dark:text-red-400">gm</p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4 text-center border-2 border-orange-200 dark:border-orange-800">
                    <p className="text-xs text-orange-600 dark:text-orange-400 uppercase font-semibold mb-1">
                      {t("lungs")}
                    </p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {currentMember.lungsShare.toFixed(0)}
                    </p>
                    <p className="text-xs text-orange-500 dark:text-orange-400">gm</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center border-2 border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold mb-1">
                      {t("bone")}
                    </p>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {currentMember.boneShare.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">gm</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6">
        <Button
          onClick={handlePrevious}
          size="lg"
          variant="secondary"
          className="rounded-full h-14 w-14 shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div className="text-white dark:text-gray-300 text-sm bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
          {t("pressKeys")}
        </div>

        <Button
          onClick={handleNext}
          size="lg"
          variant="secondary"
          className="rounded-full h-14 w-14 shadow-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
