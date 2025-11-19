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
import { ArrowLeft, Plus, Trash2, Pencil } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { SettingsMenu } from "@/components/SettingsMenu";
import { UserMenu } from "@/components/UserMenu";

interface Donor {
  id: string;
  name: string;
  phone?: string;
  beef: number;
  lungs: number;
  bone: number;
  createdAt: string;
}

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    beef: "",
    lungs: "",
    bone: "",
  });
  const { toast } = useToast();
  const { t } = useApp();

  const fetchDonors = async () => {
    try {
      const res = await fetch("/api/donors");
      const data = await res.json();
      setDonors(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch donors",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDonor) {
        // Update existing donor
        const res = await fetch("/api/donors", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingDonor.id,
            ...formData,
          }),
        });

        if (res.ok) {
          toast({
            title: "Success",
            description: "Donor updated successfully",
          });
          setIsDialogOpen(false);
          setEditingDonor(null);
          setFormData({ name: "", phone: "", beef: "", lungs: "", bone: "" });
          fetchDonors();
        } else {
          throw new Error("Failed to update donor");
        }
      } else {
        // Create new donor
        const res = await fetch("/api/donors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          toast({
            title: "Success",
            description: "Donor added successfully",
          });
          setIsDialogOpen(false);
          setFormData({ name: "", phone: "", beef: "", lungs: "", bone: "" });
          fetchDonors();
        } else {
          throw new Error("Failed to add donor");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: editingDonor
          ? "Failed to update donor"
          : "Failed to add donor",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (donor: Donor) => {
    setEditingDonor(donor);
    setFormData({
      name: donor.name,
      phone: donor.phone || "",
      beef: donor.beef.toString(),
      lungs: donor.lungs.toString(),
      bone: donor.bone.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingDonor(null);
      setFormData({ name: "", phone: "", beef: "", lungs: "", bone: "" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donor?")) return;

    try {
      const res = await fetch(`/api/donors?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Donor deleted successfully",
        });
        fetchDonors();
      } else {
        throw new Error("Failed to delete donor");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete donor",
        variant: "destructive",
      });
    }
  };

  const totalBeef = donors.reduce((sum: number, d: Donor) => sum + d.beef, 0);
  const totalLungs = donors.reduce((sum: number, d: Donor) => sum + d.lungs, 0);
  const totalBone = donors.reduce((sum: number, d: Donor) => sum + d.bone, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
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
              <h1 className="text-4xl font-bold text-green-800 dark:text-green-400">
                {t("donorManagement")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("trackDonations")}
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                {t("addDonor")}
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="dark:text-white">
                    {editingDonor ? t("editDonor") : t("addNewDonor")}
                  </DialogTitle>
                  <DialogDescription className="dark:text-gray-400">
                    {editingDonor
                      ? t("updateDonorDetails")
                      : t("enterDonorDetails")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="dark:text-gray-300">
                      {t("name")} *
                    </Label>
                    <Input
                      id="name"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="dark:text-gray-300">
                      {t("phone")}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="beef" className="dark:text-gray-300">
                      {t("beef")} (gm)
                    </Label>
                    <Input
                      id="beef"
                      type="number"
                      step="0.01"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.beef}
                      onChange={(e) =>
                        setFormData({ ...formData, beef: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lungs" className="dark:text-gray-300">
                      {t("lungs")} (gm)
                    </Label>
                    <Input
                      id="lungs"
                      type="number"
                      step="0.01"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.lungs}
                      onChange={(e) =>
                        setFormData({ ...formData, lungs: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bone" className="dark:text-gray-300">
                      {t("bone")} (gm)
                    </Label>
                    <Input
                      id="bone"
                      type="number"
                      step="0.01"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.bone}
                      onChange={(e) =>
                        setFormData({ ...formData, bone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingDonor ? t("updateDonor") : t("addDonor")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardDescription className="dark:text-gray-400">
                {t("totalDonors")}
              </CardDescription>
              <CardTitle className="text-3xl dark:text-white">
                {donors.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardDescription className="dark:text-gray-400">
                {t("totalBeef")} (gm)
              </CardDescription>
              <CardTitle className="text-3xl dark:text-white">
                {totalBeef.toFixed(0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardDescription className="dark:text-gray-400">
                {t("totalLungs")} (gm)
              </CardDescription>
              <CardTitle className="text-3xl dark:text-white">
                {totalLungs.toFixed(0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardDescription className="dark:text-gray-400">
                {t("totalBone")} (gm)
              </CardDescription>
              <CardTitle className="text-3xl dark:text-white">
                {totalBone.toFixed(0)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Donors Table */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">{t("allDonors")}</CardTitle>
            <CardDescription className="dark:text-gray-400">
              {t("donorsList")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 dark:text-gray-300">
                {t("loading")}
              </div>
            ) : donors.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t("noDonorsYet")}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead className="dark:text-gray-300">
                        {t("name")}
                      </TableHead>
                      <TableHead className="dark:text-gray-300">
                        {t("phone")}
                      </TableHead>
                      <TableHead className="text-right dark:text-gray-300">
                        {t("beef")} (gm)
                      </TableHead>
                      <TableHead className="text-right dark:text-gray-300">
                        {t("lungs")} (gm)
                      </TableHead>
                      <TableHead className="text-right dark:text-gray-300">
                        {t("bone")} (gm)
                      </TableHead>
                      <TableHead className="text-right dark:text-gray-300">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donors.map((donor) => (
                      <TableRow key={donor.id} className="dark:border-gray-700">
                        <TableCell className="font-medium dark:text-white">
                          {donor.name}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          {donor.phone || "-"}
                        </TableCell>
                        <TableCell className="text-right dark:text-gray-300">
                          {donor.beef.toFixed(0)}
                        </TableCell>
                        <TableCell className="text-right dark:text-gray-300">
                          {donor.lungs.toFixed(0)}
                        </TableCell>
                        <TableCell className="text-right dark:text-gray-300">
                          {donor.bone.toFixed(0)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="dark:hover:bg-gray-700"
                              onClick={() => handleEdit(donor)}
                              title={t("editDonor")}
                            >
                              <Pencil className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="dark:hover:bg-gray-700"
                              onClick={() => handleDelete(donor.id)}
                              title={t("deleteDonor")}
                            >
                              <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
