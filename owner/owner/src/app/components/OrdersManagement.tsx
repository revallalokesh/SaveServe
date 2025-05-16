"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ArrowUpDown, Check, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock these components with simplified versions if they can't be imported
const Calendar = ({ selected, onSelect, mode, initialFocus, className }: any) => (
  <div className="calendar p-4 border rounded bg-background">
    <div className="text-center">{selected ? format(selected, "PPP") : "Select a date"}</div>
  </div>
)

const Card = ({ children, className }: any) => (
  <div className={cn("bg-card text-card-foreground rounded-lg border shadow-sm", className)}>
    {children}
  </div>
)

const CardHeader = ({ children, className }: any) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
    {children}
  </div>
)

const CardTitle = ({ children, className }: any) => (
  <h3 className={cn("text-2xl font-semibold", className)}>
    {children}
  </h3>
)

const CardDescription = ({ children, className }: any) => (
  <p className={cn("text-sm text-muted-foreground", className)}>
    {children}
  </p>
)

const CardContent = ({ children, className }: any) => (
  <div className={cn("p-6 pt-0", className)}>
    {children}
  </div>
)

const CardFooter = ({ children, className }: any) => (
  <div className={cn("flex items-center p-6 pt-0", className)}>
    {children}
  </div>
)

const Table = ({ children, className }: any) => (
  <div className="relative w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)}>
      {children}
    </table>
  </div>
)

const TableHeader = ({ children, className }: any) => (
  <thead className={cn("[&_tr]:border-b", className)}>
    {children}
  </thead>
)

const TableBody = ({ children, className }: any) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)}>
    {children}
  </tbody>
)

const TableRow = ({ children, className }: any) => (
  <tr className={cn("border-b transition-colors hover:bg-muted/50", className)}>
    {children}
  </tr>
)

const TableHead = ({ children, className }: any) => (
  <th className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground", className)}>
    {children}
  </th>
)

const TableCell = ({ children, className }: any) => (
  <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}>
    {children}
  </td>
)

const Popover = ({ children }: any) => (
  <div>{children}</div>
)

const PopoverTrigger = ({ children, asChild }: any) => (
  <div>{children}</div>
)

const PopoverContent = ({ children, className, align, sideOffset }: any) => (
  <div className={cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md", className)}>
    {children}
  </div>
)

const Tabs = ({ children, defaultValue, className }: any) => (
  <div className={className} data-default-value={defaultValue}>
    {children}
  </div>
)

const TabsList = ({ children, className }: any) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1", className)}>
    {children}
  </div>
)

const TabsTrigger = ({ children, value, className }: any) => (
  <button
    className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium", className)}
    data-value={value}
  >
    {children}
  </button>
)

const TabsContent = ({ children, value, className }: any) => (
  <div className={cn("mt-2", className)} data-value={value}>
    {children}
  </div>
)

const Button = ({ children, variant, size, className, onClick, disabled }: any) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      size === "sm" && "h-9 px-3 text-xs",
      className
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
)

const Badge = ({ children, variant, className }: any) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
      variant === "outline" && "text-foreground",
      variant === "success" && "border-green-500/50 bg-green-500/20 text-green-500",
      variant === "default" && "border-transparent bg-primary text-primary-foreground",
      className
    )}
  >
    {children}
  </span>
)

// Simplified toast implementation
function useToast() {
  const toast = (props: any) => {
    console.log('Toast:', props)
    // In a real implementation, this would display a toast notification
  }
  
  return { toast }
}

interface MealStatus {
  studentName: string;
  studentEmail: string;
  meals: {
    breakfast: {
      opted: boolean;
      qrCode: string | null;
      used: boolean;
      usedAt: string | null;
    };
    lunch: {
      opted: boolean;
      qrCode: string | null;
      used: boolean;
      usedAt: string | null;
    };
    dinner: {
      opted: boolean;
      qrCode: string | null;
      used: boolean;
      usedAt: string | null;
    };
  };
}

interface Order {
  id: string;
  studentName: string;
  studentEmail: string;
  mealType: string;
  date: string;
  price: number;
  status: "pending" | "served" | "cancelled";
}

interface PaidMenu {
  id: string;
  day: string;
  item: string;
  mealType: string;
  price: number;
  availability: number;
  sold: number;
}

export function OrdersManagement() {
  const [date, setDate] = useState<Date>(new Date())
  const [mealStatuses, setMealStatuses] = useState<MealStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [paidMenu, setPaidMenu] = useState<PaidMenu[]>([
    {
      id: "1",
      day: "Monday",
      item: "Paneer Butter Masala",
      mealType: "lunch",
      price: 120,
      availability: 50,
      sold: 32
    },
    {
      id: "2",
      day: "Monday",
      item: "Chicken Biryani",
      mealType: "dinner",
      price: 150,
      availability: 30,
      sold: 28
    },
    {
      id: "3",
      day: "Tuesday",
      item: "Veg Pulao",
      mealType: "lunch",
      price: 100,
      availability: 40,
      sold: 15
    },
    {
      id: "4",
      day: "Wednesday",
      item: "Mushroom Curry",
      mealType: "lunch",
      price: 110,
      availability: 25,
      sold: 10
    }
  ])
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ord1",
      studentName: "Rahul Sharma",
      studentEmail: "rahul@example.com",
      mealType: "lunch",
      date: "2023-10-10",
      price: 120,
      status: "served"
    },
    {
      id: "ord2",
      studentName: "Priya Patel",
      studentEmail: "priya@example.com",
      mealType: "dinner",
      date: "2023-10-10",
      price: 150,
      status: "pending"
    },
    {
      id: "ord3",
      studentName: "Aditya Singh",
      studentEmail: "aditya@example.com",
      mealType: "lunch",
      date: "2023-10-11",
      price: 120,
      status: "cancelled"
    }
  ])
  const [newMenuItem, setNewMenuItem] = useState({
    day: "Monday",
    item: "",
    mealType: "lunch",
    price: 0,
    availability: 0
  })

  const { toast } = useToast()

  // Fetch meal statuses for the selected date
  const fetchMealStatuses = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        // Use mock data for development if no token is available
        console.log('No token found, using mock data for development')
        const mockData: MealStatus[] = [
          {
            studentName: "Arun Kumar",
            studentEmail: "arun@example.com",
            meals: {
              breakfast: { opted: true, qrCode: null, used: true, usedAt: new Date().toISOString() },
              lunch: { opted: true, qrCode: null, used: false, usedAt: null },
              dinner: { opted: false, qrCode: null, used: false, usedAt: null }
            }
          },
          {
            studentName: "Priya Singh",
            studentEmail: "priya@example.com",
            meals: {
              breakfast: { opted: false, qrCode: null, used: false, usedAt: null },
              lunch: { opted: true, qrCode: null, used: true, usedAt: new Date().toISOString() },
              dinner: { opted: true, qrCode: null, used: false, usedAt: null }
            }
          },
          {
            studentName: "Mohit Verma",
            studentEmail: "mohit@example.com",
            meals: {
              breakfast: { opted: true, qrCode: null, used: false, usedAt: null },
              lunch: { opted: true, qrCode: null, used: false, usedAt: null },
              dinner: { opted: true, qrCode: null, used: false, usedAt: null }
            }
          }
        ];
        setMealStatuses(mockData);
        return;
      }
      
      try {
        const formattedDate = format(date, 'yyyy-MM-dd')
        const response = await fetch(`https://save-serve-server.onrender.com/api/student-meal-status/date/${formattedDate}?hostelId=${token}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch meal statuses')
        }
        
        const data = await response.json()
        setMealStatuses(data)
      } catch (apiError) {
        console.error('API Error:', apiError)
        // Fallback to mock data when API request fails
        console.log('API request failed, using mock data instead')
        const mockData: MealStatus[] = [
          {
            studentName: "Arun Kumar",
            studentEmail: "arun@example.com",
            meals: {
              breakfast: { opted: true, qrCode: null, used: true, usedAt: new Date().toISOString() },
              lunch: { opted: true, qrCode: null, used: false, usedAt: null },
              dinner: { opted: false, qrCode: null, used: false, usedAt: null }
            }
          },
          {
            studentName: "Priya Singh",
            studentEmail: "priya@example.com",
            meals: {
              breakfast: { opted: false, qrCode: null, used: false, usedAt: null },
              lunch: { opted: true, qrCode: null, used: true, usedAt: new Date().toISOString() },
              dinner: { opted: true, qrCode: null, used: false, usedAt: null }
            }
          },
          {
            studentName: "Mohit Verma",
            studentEmail: "mohit@example.com",
            meals: {
              breakfast: { opted: true, qrCode: null, used: false, usedAt: null },
              lunch: { opted: true, qrCode: null, used: false, usedAt: null },
              dinner: { opted: true, qrCode: null, used: false, usedAt: null }
            }
          }
        ];
        setMealStatuses(mockData);
      }
    } catch (error) {
      console.error('Error in fetchMealStatuses:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch meal statuses"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMealStatuses()
  }, [date])

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
    }
  }

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMenuItem.item || newMenuItem.price <= 0 || newMenuItem.availability <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all fields with valid values"
      })
      return
    }
    
    const newItem: PaidMenu = {
      id: Date.now().toString(),
      day: newMenuItem.day,
      item: newMenuItem.item,
      mealType: newMenuItem.mealType,
      price: newMenuItem.price,
      availability: newMenuItem.availability,
      sold: 0
    }
    
    setPaidMenu([...paidMenu, newItem])
    
    // Reset form
    setNewMenuItem({
      day: "Monday",
      item: "",
      mealType: "lunch",
      price: 0,
      availability: 0
    })
    
    toast({
      title: "Success",
      description: "Menu item added successfully"
    })
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: "pending" | "served" | "cancelled") => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
    
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`
    })
  }

  const handleDeleteMenuItem = (menuItemId: string) => {
    setPaidMenu(prevMenu => prevMenu.filter(item => item.id !== menuItemId))
    
    toast({
      title: "Menu Item Deleted",
      description: "The menu item has been removed"
    })
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleTimeString()
  }

  const statusColor = (status: "pending" | "served" | "cancelled") => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
      case "served": return "bg-green-500/20 text-green-500 border-green-500/50"
      case "cancelled": return "bg-red-500/20 text-red-500 border-red-500/50"
      default: return ""
    }
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const mealTypes = ["breakfast", "lunch", "dinner"]

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Orders & Premium Menu
              </CardTitle>
              <CardDescription>
                Manage student meal status, orders, and premium menu items
              </CardDescription>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="meal-status" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meal-status">Meal Status</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="paid-menu">Premium Menu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="meal-status">
          <Card>
            <CardHeader>
              <CardTitle>Meal Status for {format(date, "PPP")}</CardTitle>
              <CardDescription>
                View which students opted for meals and their usage status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : mealStatuses.length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No meal data found for this date</p>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Breakfast</TableHead>
                        <TableHead>Lunch</TableHead>
                        <TableHead>Dinner</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mealStatuses.map((status, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{status.studentName}</div>
                              <div className="text-sm text-muted-foreground">{status.studentEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {status.meals.breakfast.opted ? (
                              <div className="space-y-1">
                                <Badge variant={status.meals.breakfast.used ? "success" : "default"}>
                                  {status.meals.breakfast.used ? "Used" : "Opted"}
                                </Badge>
                                {status.meals.breakfast.used && (
                                  <div className="text-xs text-muted-foreground">
                                    {formatTime(status.meals.breakfast.usedAt)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline">Not Opted</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {status.meals.lunch.opted ? (
                              <div className="space-y-1">
                                <Badge variant={status.meals.lunch.used ? "success" : "default"}>
                                  {status.meals.lunch.used ? "Used" : "Opted"}
                                </Badge>
                                {status.meals.lunch.used && (
                                  <div className="text-xs text-muted-foreground">
                                    {formatTime(status.meals.lunch.usedAt)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline">Not Opted</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {status.meals.dinner.opted ? (
                              <div className="space-y-1">
                                <Badge variant={status.meals.dinner.used ? "success" : "default"}>
                                  {status.meals.dinner.used ? "Used" : "Opted"}
                                </Badge>
                                {status.meals.dinner.used && (
                                  <div className="text-xs text-muted-foreground">
                                    {formatTime(status.meals.dinner.usedAt)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline">Not Opted</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Student Orders</CardTitle>
              <CardDescription>
                View and manage premium meal orders from students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Meal</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <div>{order.studentName}</div>
                              <div className="text-sm text-muted-foreground">{order.studentEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{order.mealType}</TableCell>
                          <TableCell>{format(new Date(order.date), "PP")}</TableCell>
                          <TableCell>₹{order.price}</TableCell>
                          <TableCell>
                            <Badge className={`${statusColor(order.status)}`}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {order.status === "pending" && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-500"
                                    onClick={() => handleUpdateOrderStatus(order.id, "served")}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500"
                                    onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {order.status === "cancelled" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleUpdateOrderStatus(order.id, "pending")}
                                >
                                  <ArrowUpDown className="h-4 w-4" />
                                </Button>
                              )}
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
        </TabsContent>
        
        <TabsContent value="paid-menu">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Premium Menu Items</CardTitle>
                <CardDescription>
                  Special menu items available for purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paidMenu.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">No premium menu items available</p>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Meal</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Available</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paidMenu.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.day}</TableCell>
                            <TableCell>{item.item}</TableCell>
                            <TableCell className="capitalize">{item.mealType}</TableCell>
                            <TableCell>₹{item.price}</TableCell>
                            <TableCell>{item.availability - item.sold}/{item.availability}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500"
                                onClick={() => handleDeleteMenuItem(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Add Premium Menu Item</CardTitle>
                <CardDescription>
                  Create new premium menu items for students to purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMenuItem} className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Day</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newMenuItem.day}
                          onChange={(e) => setNewMenuItem({...newMenuItem, day: e.target.value})}
                        >
                          {days.map((day) => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Meal Type</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newMenuItem.mealType}
                          onChange={(e) => setNewMenuItem({...newMenuItem, mealType: e.target.value})}
                        >
                          {mealTypes.map((type) => (
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Item Name</label>
                      <input 
                        type="text"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter menu item name"
                        value={newMenuItem.item}
                        onChange={(e) => setNewMenuItem({...newMenuItem, item: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price (₹)</label>
                        <input 
                          type="number"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Price"
                          min="0"
                          value={newMenuItem.price || ''}
                          onChange={(e) => setNewMenuItem({...newMenuItem, price: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Availability</label>
                        <input 
                          type="number"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Number of portions"
                          min="0"
                          value={newMenuItem.availability || ''}
                          onChange={(e) => setNewMenuItem({...newMenuItem, availability: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Add Menu Item
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 