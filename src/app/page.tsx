"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UserPlus,
  Calculator,
  Presentation,
  Home as HomeIcon,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { SettingsMenu } from "@/components/SettingsMenu";
import { UserMenu } from "@/components/UserMenu";

export default function Home() {
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-12">
        {/* Settings */}
        <div className="flex justify-end mb-4 gap-2">
          <UserMenu />
          <SettingsMenu />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-800 dark:text-green-400 mb-4">
            🐄 {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("subtitle")}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/donors">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <UserPlus className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {t("donors")}
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {t("donorsDesc")}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/members">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {t("members")}
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {t("membersDesc")}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/houses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <HomeIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Houses
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Manage slideshow priority
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/distribution">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Calculator className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  {t("distribution")}
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {t("distributionDesc")}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/slideshow">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Presentation className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  {t("slideshow")}
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {t("slideshowDesc")}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            {t("keyFeatures")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  {t("donorManagement")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("donorManagementDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  {t("memberTracking")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("memberTrackingDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <Calculator className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  {t("autoDistribution")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("autoDistributionDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                <Presentation className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  {t("visualSlideshow")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("visualSlideshowDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link href="/donors">
            <Button size="lg" className="text-lg px-8 py-6">
              {t("getStarted")} →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
