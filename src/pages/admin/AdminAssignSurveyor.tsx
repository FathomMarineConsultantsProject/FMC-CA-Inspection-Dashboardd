import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminAssignSurveyor = () => {

const surveyors = [
{ id:"S1", name:"John Smithhh", location:"Mumbai", email:"john@test.com"},
{ id:"S2", name:"David Lee", location:"Dubai", email:"david@test.com"},
{ id:"S3", name:"Rahul Sharma", location:"Singapore", email:"rahul@test.com"},
{ id:"S4", name:"Carlos Diaz", location:"London", email:"carlos@test.com"}
];

const [inspection,setInspection] = useState({
inspectionType:"",
shipType:"",
location:"",
dateFrom:"",
dateTo:"",
fees:""
});

const [selectedSurveyors,setSelectedSurveyors] = useState([]);

const handleChange=(e)=>{
setInspection({...inspection,[e.target.name]:e.target.value})
}

const handleSurveyorSelect=(id)=>{
if(selectedSurveyors.includes(id)){
setSelectedSurveyors(selectedSurveyors.filter(s=>s!==id))
}else{
setSelectedSurveyors([...selectedSurveyors,id])
}
}

const handleSendMail=()=>{

if(!inspection.inspectionType || selectedSurveyors.length===0){
toast.error("Fill inspection data and select surveyors")
return
}

const surveyorEmails = surveyors
.filter(s=>selectedSurveyors.includes(s.id))
.map(s=>s.email)

console.log("Inspection Data:",inspection)
console.log("Send email to:",surveyorEmails)

toast.success("Inspection request sent to surveyors")
}

return (
<div className="max-w-3xl space-y-6">

<h1 className="text-2xl font-bold">Create Inspection</h1>

<Card>
<CardContent className="space-y-4 pt-6">

<input
name="inspectionType"
placeholder="Inspection Type"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
name="shipType"
placeholder="Ship Type"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
name="location"
placeholder="Location"
className="border p-2 w-full"
onChange={handleChange}
/>

<div className="flex gap-4">
<input
type="date"
name="dateFrom"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
type="date"
name="dateTo"
className="border p-2 w-full"
onChange={handleChange}
/>
</div>

<input
name="fees"
placeholder="Inspection Fees"
className="border p-2 w-full"
onChange={handleChange}
/>

<div>

<p className="font-semibold mb-2">Select Surveyors</p>

{surveyors.map(s=>(
<label key={s.id} className="flex gap-2 border p-2 rounded mb-2">

<input
type="checkbox"
onChange={()=>handleSurveyorSelect(s.id)}
/>

{s.name} ({s.location})

</label>
))}

</div>

<Button onClick={handleSendMail} className="w-full">
Send Inspection Request
</Button>

</CardContent>
</Card>

</div>
)
}

export default AdminAssignSurveyor