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
import { ArrowLeft, Plus, Trash2, Pencil, Home } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { SettingsMenu } from "@/components/SettingsMenu";
import { UserMenu } from "@/components/UserMenu";

interface House {
  id: string;
  name: string;
  priority: number;
  createdAt: string;
}

export default function HousesPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    priority: "999",
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
    try {
      if (editingHouse) {
        // Update existing house
        const res = await fetch("/api/houses", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingHouse.id,
            ...formData,
            priority: parseInt(formData.priority),
          }),
        });

        if (res.ok) {
          toast({
            title: "Success",
            description: "House updated successfully",
          });
          setIsDialogOpen(false);
          setEditingHouse(null);
          setFormData({ name: "", priority: "999" });
          fetchHouses();
        } else {
          throw new Error("Failed to update house");
        }
      } else {
        // Create new house
        const res = await fetch("/api/houses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          toast({
            title: "Success",
            description: "House added successfully",
          });
          setIsDialogOpen(false);
          setFormData({ name: "", priority: "999" });
          fetchHouses();
        } else {
          throw new Error("Failed to add house");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: editingHouse
          ? "Failed to update house"
          : "Failed to add house",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (house: House) => {
    setEditingHouse(house);
    setFormData({
      name: house.name,
      priority: house.priority.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingHouse(null);
      setFormData({ name: "", priority: "999" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this house?")) return;

    try {
      const res = await fetch(`/api/houses?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "House deleted successfully",
        });
        fetchHouses();
      } else {
        throw new Error("Failed to delete house");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete house",
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
                House Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage houses and their priorities
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                Add House
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingHouse ? "Edit House" : "Add New House"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingHouse
                      ? "Update house details"
                      : "Enter house details"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">House Name *</Label>
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
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="999"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target.value,
                        })
                      }
                      placeholder="999 (no priority)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingHouse ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Houses Table */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              All Houses ({houses.length})
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              List of registered houses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 dark:text-gray-300">
                Loading...
              </div>
            ) : houses.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No houses found. Click "Add House" to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="dark:text-gray-300">Name</TableHead>
                      <TableHead className="text-center dark:text-gray-300">
                        Priority
                      </TableHead>
                      <TableHead className="text-right dark:text-gray-300">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {houses.map((house) => (
                      <TableRow key={house.id} className="dark:border-gray-700">
                        <TableCell className="font-medium dark:text-white">
                          {house.name}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-orange-600 dark:text-orange-400">
                          {house.priority < 999 ? house.priority : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(house)}
                              title="Edit house"
                            >
                              <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(house.id)}
                              title="Delete house"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
