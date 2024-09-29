using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AUTRA.FEM.Entities.BoundaryConditions.Constraints
{
    public class Constraint3D : Constraint
    {
       
        public bool IsUxFree => Free[0];
        public bool IsUyFree => Free[1];
        public bool IsUzFree => Free[2];

        public Constraint3D(bool u1, bool u2, bool u3)
            :base(new bool[3] { u1, u2, u3 })
        {
        }

        public Constraint3D()
            :base(new bool[3] { true, true, true })
        {
        }

        override public string ToString()
        {
            Func<bool, string> f = (b) => b ? "free" : "fixed";
            return $"Ux: {f(IsUxFree)}, Uy: {f(IsUyFree)}, Uz: {f(IsUzFree)}";
        }
    }
}
