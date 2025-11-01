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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Home, Plus, Pencil, Users } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { SettingsMenu } from "@/components/SettingsMenu";

interface House {
  houseName: string;
  housePriority: number;
  memberCount: number;
}

export default function HousesPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [formData, setFormData] = useState({
    houseName: "",
    housePriority: "999",
  });
  const { toast } = useToast();
  const { t } = useApp();

  const fetchHouses = async () => {
    try {
      const res = await fetch("/api/houses");
      const data = await res.json();
      setHouses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch houses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.houseName.trim()) {
      toast({
        title: "Error",
        description: "House name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("/api/houses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          houseName: formData.houseName.trim(),
          housePriority: parseInt(formData.housePriority) || 999,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast({
          title: t("success"),
          description: `${t("updated")} ${data.updatedCount} ${t("members")}`,
        });
        setIsDialogOpen(false);
        setEditingHouse(null);
        setFormData({ houseName: "", housePriority: "999" });
        fetchHouses();
      } else {
        throw new Error("Failed to update house");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update house priority",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (house: House) => {
    setEditingHouse(house);
    setFormData({
      houseName: house.houseName,
      housePriority: house.housePriority.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingHouse(null);
      setFormData({ houseName: "", housePriority: "999" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center dark:text-gray-300">{t("loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Settings Menu */}
        <div className="flex justify-end mb-4">
          <SettingsMenu />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
              <h1 className="text-4xl font-bold text-green-800 dark:text-green-400">
                {t("houseManagement")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("manageSlideshowPriority")}
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  {t("howItWorks")}
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• {t("houseInfo1")}</li>
                  <li>• {t("houseInfo2")}</li>
                  <li>• {t("houseInfo3")}</li>
                  <li>• {t("houseInfo4")}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Houses Table */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">{t("allHouses")}</CardTitle>
            <CardDescription className="dark:text-gray-400">
              {t("clickToSetPriority")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {houses.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t("noHousesYet")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="dark:text-gray-300">
                      {t("houseName")}
                    </TableHead>
                    <TableHead className="dark:text-gray-300">
                      {t("memberCount")}
                    </TableHead>
                    <TableHead className="dark:text-gray-300">
                      {t("currentPriority")}
                    </TableHead>
                    <TableHead className="text-right dark:text-gray-300">
                      {t("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {houses.map((house) => (
                    <TableRow
                      key={house.houseName}
                      className="dark:border-gray-700"
                    >
                      <TableCell className="font-medium dark:text-white">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-green-600 dark:text-green-400" />
                          {house.houseName}
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          {house.memberCount} {t("members")}
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        {house.housePriority < 999 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                            {house.housePriority}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="dark:hover:bg-gray-700"
                          onClick={() => handleEdit(house)}
                        >
                          <Pencil className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                          {t("setPriority")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="dark:text-white">
                  {t("setHousePriority")}
                </DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  {t("allMembersWillUpdate")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="houseName" className="dark:text-gray-300">
                    {t("houseName")}
                  </Label>
                  <Input
                    id="houseName"
                    value={formData.houseName}
                    disabled
                    className="bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority" className="dark:text-gray-300">
                    {t("housePriority")} *
                  </Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="999"
                    value={formData.housePriority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        housePriority: e.target.value,
                      })
                    }
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("lowerNumberHigherPriority")}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{t("updateAllMembers")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
