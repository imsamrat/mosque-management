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
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { SettingsMenu } from "@/components/SettingsMenu";
import { UserMenu } from "@/components/UserMenu";

interface Member {
  id: string;
  name: string;
  fatherName: string;
  houseName: string;
  houseId?: string;
  housePriority: number;
  familyMembers: number;
  beefShare: number;
  lungsShare: number;
  boneShare: number;
  status: "PENDING" | "COMPLETED";
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    houseId: "",
    houseName: "",
    housePriority: "999",
    familyMembers: "1",
  });
  const { toast } = useToast();
  const { t } = useApp();

  const [houses, setHouses] = useState<{ id: string; name: string; priority: number }[]>([]);

  const fetchHouses = async () => {
    try {
      const res = await fetch("/api/houses");
      if (res.ok) {
        const data = await res.json();
        setHouses(data);
      }
    } catch (error) {
      console.error("Failed to fetch houses");
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(
        `/api/members?page=${pagination.page}&limit=${pagination.limit}&search=${search}`
      );
      const data = await res.json();
      setMembers(data.members);
      setPagination(data.pagination);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchHouses();
  }, [pagination.page, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        // Update existing member
        const res = await fetch("/api/members", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMember.id,
            ...formData,
            housePriority: parseInt(formData.housePriority),
            familyMembers: parseInt(formData.familyMembers),
          }),
        });

        if (res.ok) {
          toast({
            title: t("success"),
            description: t("memberUpdatedSuccess"),
          });
          setIsDialogOpen(false);
          setEditingMember(null);
          setFormData({
            name: "",
            fatherName: "",
            houseId: "",
            houseName: "",
            housePriority: "999",
            familyMembers: "1",
          });
          fetchMembers();
        } else {
          throw new Error("Failed to update member");
        }
      } else {
        // Create new member
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          toast({
            title: t("success"),
            description: t("memberAddedSuccess"),
          });
          setIsDialogOpen(false);
          setFormData({
            name: "",
            fatherName: "",
            houseId: "",
            houseName: "",
            housePriority: "999",
            familyMembers: "1",
          });
          fetchMembers();
        } else {
          throw new Error("Failed to add member");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: editingMember
          ? "Failed to update member"
          : "Failed to add member",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      fatherName: member.fatherName,
      houseId: member.houseId || "",
      houseName: member.houseName,
      housePriority: member.housePriority.toString(),
      familyMembers: member.familyMembers.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingMember(null);
      setFormData({
        name: "",
        fatherName: "",
        houseId: "",
        houseName: "",
        housePriority: "999",
        familyMembers: "1",
      });
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "PENDING" ? "COMPLETED" : "PENDING";
    try {
      const res = await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: `Status updated to ${newStatus}`,
        });
        fetchMembers();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const res = await fetch(`/api/members?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Member deleted successfully",
        });
        fetchMembers();
      } else {
        throw new Error("Failed to delete member");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Settings */}
        <div className="flex justify-end mb-4 gap-2">
          <UserMenu />
          <SettingsMenu />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-400">
                {t("memberManagementTitle")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {t("memberManagementSubtitle")}
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                {t("addMember")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingMember ? t("editMember") : t("addNewMember")}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMember
                      ? t("updateMemberDetails")
                      : t("enterMemberDetails")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t("name")} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fatherName">{t("fatherName")} *</Label>
                    <Input
                      id="fatherName"
                      value={formData.fatherName}
                      onChange={(e) =>
                        setFormData({ ...formData, fatherName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="houseId">{t("houseName")} *</Label>
                    <select
                      id="houseId"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={formData.houseId}
                      onChange={(e) => {
                        const selectedHouse = houses.find(h => h.id === e.target.value);
                        setFormData({ 
                          ...formData, 
                          houseId: e.target.value,
                          houseName: selectedHouse ? selectedHouse.name : "",
                          housePriority: selectedHouse ? selectedHouse.priority.toString() : "999"
                        });
                      }}
                      required
                    >
                      <option value="">Select a House</option>
                      {houses.map((house) => (
                        <option key={house.id} value={house.id}>
                          {house.name} (Priority: {house.priority})
                        </option>
                      ))}
                    </select>
                    {houses.length === 0 && (
                      <p className="text-xs text-red-500">
                        No houses found. Please <Link href="/houses" className="underline">add a house</Link> first.
                      </p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="familyMembers">{t("familyMembers")}</Label>
                    <Input
                      id="familyMembers"
                      type="number"
                      min="1"
                      value={formData.familyMembers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          familyMembers: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingMember ? t("update") : t("add")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              {t("allMembers")} ({pagination.total})
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              {t("completeList")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 dark:text-gray-300">
                {t("loading")}
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No members found. Click "{t("addMember")}" to get started.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="dark:text-gray-300">
                          {t("name")}
                        </TableHead>
                        <TableHead className="dark:text-gray-300">
                          {t("fatherName")}
                        </TableHead>
                        <TableHead className="dark:text-gray-300">
                          {t("houseName")}
                        </TableHead>
                        <TableHead className="text-center dark:text-gray-300">
                          {t("housePriority")}
                        </TableHead>
                        <TableHead className="text-center dark:text-gray-300">
                          {t("familyMembers")}
                        </TableHead>
                        <TableHead className="text-right dark:text-gray-300">
                          {t("beefShare")}
                        </TableHead>
                        <TableHead className="text-right dark:text-gray-300">
                          {t("lungsShare")}
                        </TableHead>
                        <TableHead className="text-right dark:text-gray-300">
                          {t("boneShare")}
                        </TableHead>
                        <TableHead className="dark:text-gray-300">
                          {t("status")}
                        </TableHead>
                        <TableHead className="text-right dark:text-gray-300">
                          {t("actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow
                          key={member.id}
                          className="dark:border-gray-700"
                        >
                          <TableCell className="font-medium dark:text-white">
                            {member.name}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {member.fatherName}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {member.houseName}
                          </TableCell>
                          <TableCell className="text-center font-semibold text-orange-600 dark:text-orange-400">
                            {member.housePriority < 999
                              ? member.housePriority
                              : "-"}
                          </TableCell>
                          <TableCell className="text-center font-semibold text-blue-600 dark:text-blue-400">
                            {member.familyMembers}
                          </TableCell>
                          <TableCell className="text-right dark:text-gray-300">
                            {member.beefShare.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right dark:text-gray-300">
                            {member.lungsShare.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right dark:text-gray-300">
                            {member.boneShare.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={
                                member.status === "COMPLETED"
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                handleStatusToggle(member.id, member.status)
                              }
                            >
                              {member.status === "COMPLETED" ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  Completed
                                </>
                              ) : (
                                <>
                                  <Clock className="h-4 w-4" />
                                  Pending
                                </>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(member)}
                                title="Edit member"
                              >
                                <Pencil className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(member.id)}
                                title="Delete member"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} members
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page - 1,
                        })
                      }
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page + 1,
                        })
                      }
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
