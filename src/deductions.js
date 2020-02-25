const EMPLOYEE_COST = 1000.00;
const DEPENDENT_COST = 500.00;
const EMPLOYEE_PAY = 2000.00;

// function returns price adjusted by eligible discounts
function ApplyDiscount(name, price){
  if (name === undefined){
    return price
  }
  var nameTrimmed = name.trim()
  if (nameTrimmed[0] === 'A' || nameTrimmed[0] === 'a'){ // Anyone whose name starts with ‘A’ gets a 10% discount
    return price * .9
  }else{ // else they pay full price
    return price
  }
}

 function CalculatePayPeriods(numPeriods,yearlyDeduction){

  var deductions = []
  for(var i = numPeriods; i >= 1; i--){
    var currDeduction = (yearlyDeduction/i).toFixed(2) // will round to nearest
    deductions.push(currDeduction)
    yearlyDeduction-=currDeduction

  }
  return deductions
}


export default function CalculateYearlyDeduction(data){
  var costDict = {};
  if ("employee" in data && data["employee"] !== undefined){
      // each employee pays a base of $1000 dollars
      costDict[data["employee"]] = ApplyDiscount(data["employee"], EMPLOYEE_COST)
  }

  if ("dependents" in data && data["dependents"] !== undefined){
      // Each dependent incurs a cost of $500/year
      var deps = data["dependents"]
      for (var i = 0; i < deps.length; i++){
        if (deps[i] !== null && deps[i] !== undefined && deps[i]["depName"] !== undefined){
          costDict[deps[i]["depName"]] = ApplyDiscount(deps[i]["depName"],DEPENDENT_COST)
        }
      }
  }

  // apply dicounts to those who are eligible
  var totalCost = 0
  for (var personOnAccount in costDict) {
    totalCost += costDict[personOnAccount]
  }
  costDict["TOTAL_COST"] = totalCost
  return costDict
}

export {CalculatePayPeriods, CalculateYearlyDeduction,EMPLOYEE_PAY,DEPENDENT_COST,EMPLOYEE_COST}
