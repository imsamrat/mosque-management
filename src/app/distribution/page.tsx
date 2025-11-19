"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Calculator, Users, Beef, Package } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { SettingsMenu } from "@/components/SettingsMenu";
import { UserMenu } from "@/components/UserMenu";

interface DistributionSummary {
  totals: {
    beef: number;
    lungs: number;
    bone: number;
  };
  statistics: {
    totalDonors: number;
    totalMembers: number;
    totalFamilyMembers: number;
    completedMembers: number;
    pendingMembers: number;
  };
}

export default function DistributionPage() {
  const [summary, setSummary] = useState<DistributionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  const { t } = useApp();

  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/distribution");
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch distribution summary",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleCalculateDistribution = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch("/api/distribution", {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        toast({
          title: "Success",
          description: `Distribution calculated for ${data.totalMembers} members`,
        });
        fetchSummary();
      } else {
        const error = await res.json();
        throw new Error(error.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to calculate distribution",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center dark:text-gray-300">{t("loading")}</div>
      </div>
    );
  }

  const perPersonBeef =
    summary?.totals.beef && summary?.statistics.totalFamilyMembers
      ? (summary.totals.beef / summary.statistics.totalFamilyMembers).toFixed(2)
      : "0";
  const perPersonLungs =
    summary?.totals.lungs && summary?.statistics.totalFamilyMembers
      ? (summary.totals.lungs / summary.statistics.totalFamilyMembers).toFixed(
          2
        )
      : "0";
  const perPersonBone =
    summary?.totals.bone && summary?.statistics.totalFamilyMembers
      ? (summary.totals.bone / summary.statistics.totalFamilyMembers).toFixed(2)
      : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Settings Menu */}
        <div className="flex justify-end mb-4 gap-2">
          <UserMenu />
          <SettingsMenu />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="dark:text-white dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-400">
                {t("distributionManagement")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("calculateDistribution")}
              </p>
            </div>
          </div>
          <Button
            onClick={handleCalculateDistribution}
            disabled={isCalculating}
            size="lg"
            className="gap-2 w-full md:w-auto"
          >
            <Calculator className="h-5 w-5" />
            {isCalculating ? t("calculating") : t("calculateBtn")}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 dark:text-gray-400">
                <Users className="h-4 w-4" />
                {t("totalDonors")}
              </CardDescription>
              <CardTitle className="text-4xl dark:text-white">
                {summary?.statistics.totalDonors || 0}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 dark:text-gray-400">
                <Users className="h-4 w-4" />
                {t("totalMembers")}
              </CardDescription>
              <CardTitle className="text-4xl dark:text-white">
                {summary?.statistics.totalMembers || 0}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Users className="h-4 w-4" />
                {t("totalFamilyMembers")}
              </CardDescription>
              <CardTitle className="text-4xl text-blue-600 dark:text-blue-400">
                {summary?.statistics.totalFamilyMembers || 0}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Package className="h-4 w-4" />
                {t("completed")}
              </CardDescription>
              <CardTitle className="text-4xl text-green-600 dark:text-green-400">
                {summary?.statistics.completedMembers || 0}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <Package className="h-4 w-4" />
                {t("pending")}
              </CardDescription>
              <CardTitle className="text-4xl text-orange-600 dark:text-orange-400">
                {summary?.statistics.pendingMembers || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Total Collection */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">
              {t("totalCollection")}
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              {t("totalMeatCollected")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg dark:border dark:border-red-800">
                <div className="flex items-center gap-3 mb-2">
                  <Beef className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">
                    {t("beef")}
                  </h3>
                </div>
                <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                  {summary?.totals.beef.toFixed(0) || 0} gm
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg dark:border dark:border-orange-800">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300">
                    {t("lungs")}
                  </h3>
                </div>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                  {summary?.totals.lungs.toFixed(0) || 0} gm
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg dark:border dark:border-gray-600">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                    {t("bone")}
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {summary?.totals.bone.toFixed(0) || 0} gm
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Per Person Distribution */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">
              {t("perPersonDistribution")}
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              {t("perPersonDescription")} (Total ÷{" "}
              {summary?.statistics.totalFamilyMembers || 0} {t("familyMembers")}
              )
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summary?.statistics.totalMembers === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t("noMembersYet")}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Beef className="h-6 w-6 text-red-600 dark:text-red-400" />
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">
                      {t("beefPerPerson")}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                    {perPersonBeef} gm
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300">
                      {t("lungsPerPerson")}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {perPersonLungs} gm
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                      {t("bonePerPerson")}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                    {perPersonBone} gm
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">{t("howToUse")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>{t("step1")}</li>
              <li>{t("step2")}</li>
              <li>{t("step3")}</li>
              <li>{t("step4")}</li>
              <li>{t("step5")}</li>
              <li>{t("step6")}</li>
              <li>{t("step7")}</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
