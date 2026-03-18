"use client";

import type React from "react";

import { useState } from "react";
import { Info, Loader2 } from "lucide-react";
import Image from "next/image";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Section } from "../../../types/types";
import { UploadButton } from "../../../lib/uploadthing";
import { toast } from "sonner";
import { createActivity, updateSection } from "../../../actions/site";
import { getFormattedDate } from "../../../lib/getFormatedDate";
type Stat = {
  id: string;
  value: string;
  label: string;
};
export default function AboutSectionForm({ section }: { section: Section }) {
  const {
    title: defaultTitle,
    paragraph1: defaultPara1,
    paragraph2: defaultPara2,
    image,
    stats: defaultStats,
  }: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    image: string;
    stats: Stat[];
  } = section.settings;
  const [title, setTitle] = useState(defaultTitle);
  const [paragraph1, setParagraph1] = useState(defaultPara1);
  const [paragraph2, setParagraph2] = useState(defaultPara2);
  const [aboutImage, setAboutImage] = useState(image);

  // Statistics
  const [stats, setStats] = useState(defaultStats);

  // Preview state
  const [previewTitle, setPreviewTitle] = useState(title);
  const [previewParagraph1, setPreviewParagraph1] = useState(paragraph1);
  const [previewParagraph2, setPreviewParagraph2] = useState(paragraph2);
  const [previewAboutImage, setPreviewAboutImage] = useState(aboutImage);
  const [previewStats, setPreviewStats] = useState([...stats]);
  const [loading, setLoading] = useState(false);

  // Handle stat change
  const handleStatChange = (
    id: string,
    field: "value" | "label",
    value: string
  ) => {
    const updatedStats = previewStats.map((stat) =>
      stat.id === id ? { ...stat, [field]: value } : stat
    );
    setPreviewStats(updatedStats);
  };

  // Save changes
  const saveChanges = async () => {
    setLoading(true);
    setTitle(previewTitle);
    setParagraph1(previewParagraph1);
    setParagraph2(previewParagraph2);
    setAboutImage(previewAboutImage);
    setStats([...previewStats]);
    const data = {
      settings: {
        title: previewTitle,
        paragraph1: previewParagraph1,
        paragraph2: previewParagraph2,
        image: previewAboutImage,
        stats: previewStats,
      },
    };
    try {
      console.log(data);
      await updateSection(section.id, data);
      setLoading(false);
      toast.success("About Section Updated", {
        description: " About Section Updated Successfully ",
      });
      const activity = {
        activity: `About Section was Updated Successfully`,
        description: `Admin Updated the About Section`,
        time: getFormattedDate(new Date()),
        schoolId: section.schoolId,
      };
      await createActivity(activity);
    } catch (error) {
      setLoading(false);
      toast.error("About section updated Failed", {
        description: " About section Failed to update ",
      });
      console.log(error);
    }
  };

  // Reset changes
  const resetChanges = () => {
    setPreviewTitle(title);
    setPreviewParagraph1(paragraph1);
    setPreviewParagraph2(paragraph2);
    setPreviewAboutImage(aboutImage);
    setPreviewStats([...stats]);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Content</CardTitle>
              <CardDescription>
                Update your about section title and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about-title">Section Title</Label>
                  <Input
                    id="about-title"
                    value={previewTitle}
                    onChange={(e) => setPreviewTitle(e.target.value)}
                    placeholder="Enter section title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about-paragraph1">First Paragraph</Label>
                  <Textarea
                    id="about-paragraph1"
                    value={previewParagraph1}
                    onChange={(e) => setPreviewParagraph1(e.target.value)}
                    placeholder="Enter first paragraph"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about-paragraph2">Second Paragraph</Label>
                  <Textarea
                    id="about-paragraph2"
                    value={previewParagraph2}
                    onChange={(e) => setPreviewParagraph2(e.target.value)}
                    placeholder="Enter second paragraph"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image Tab */}
        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Image</CardTitle>
              <CardDescription>Update your about section image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about-image">School Building Image</Label>
                  <div className="flex flex-col gap-4">
                    <div className="border rounded-md p-2 w-full flex h-64 items-center justify-center bg-muted">
                      <Image
                        src={previewAboutImage || "/placeholder.svg"}
                        alt="School Building"
                        width={500}
                        height={300}
                        className="object-contain h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <UploadButton
                        className="col-span-full"
                        endpoint="logoImage"
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          console.log("Files: ", res);
                          ``;
                          // logoImage(res[0].url);
                          setPreviewAboutImage(res[0].url);
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          console.log(error);
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended image size: 800x600 pixels with a 4:3 aspect
                    ratio. Use a high-quality image of your school building or
                    campus.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>School Statistics</CardTitle>
              <CardDescription>
                Update your school's key statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                  These statistics will be displayed prominently on your about
                  section. Make sure they are accurate and up-to-date.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {previewStats.map((stat) => (
                  <div
                    key={stat.id}
                    className="space-y-4 p-4 border rounded-md"
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`stat-value-${stat.id}`}>
                        Statistic Value
                      </Label>
                      <Input
                        id={`stat-value-${stat.id}`}
                        value={stat.value}
                        onChange={(e) =>
                          handleStatChange(stat.id, "value", e.target.value)
                        }
                        placeholder="Enter statistic value"
                      />
                      <p className="text-xs text-muted-foreground">
                        Include any symbols like + or % in the value
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`stat-label-${stat.id}`}>
                        Statistic Label
                      </Label>
                      <Input
                        id={`stat-label-${stat.id}`}
                        value={stat.label}
                        onChange={(e) =>
                          handleStatChange(stat.id, "label", e.target.value)
                        }
                        placeholder="Enter statistic label"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how your about section will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 h-64 md:h-auto relative bg-slate-200">
                <Image
                  src={previewAboutImage || "/placeholder.svg"}
                  alt="School Building"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2 flex flex-col justify-center space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  {previewTitle}
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{previewParagraph1}</p>
                  <p className="text-muted-foreground">{previewParagraph2}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  {previewStats.map((stat) => (
                    <div key={stat.id} className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetChanges}>
            Reset
          </Button>
          {loading ? (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Saving Please wait...
            </Button>
          ) : (
            <Button onClick={saveChanges}>Save Changes</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
