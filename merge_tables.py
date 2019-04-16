import pandas as pd
import sys
import os
import argparse


def main():
    parser = argparse.ArgumentParser(description="A command line tool for joining compound and gene info with a magi_results file.\nUsage\n>python merge_tables.py -o ecoli_k12_magi_merged.csv -magi_results_file '~/Downloads/magi_results.csv'  -gene_file ~/Downloads/GeneCart128468_09-jul-2018_important_columns.csv -gene_sep ',''")

    # output filename
    parser.add_argument('-o','--outfile', help='shell script to output', required=False,default='merged_magi_results.csv')
    parser.add_argument('-output_sep','--output_sep',help='delimiter for output file',default=',')


    # parse inputs associated with magi results file
    parser.add_argument('-magi_results_file','--magi_results_file', help='magi results file', required=True)
    parser.add_argument('-magi_gene_column','--magi_gene_column',help='column heading in magi results file for genes',default='gene_id')
    parser.add_argument('-magi_compound_column','--magi_compound_column',help='column heading in magi results file for compounds',default='original_compound')
    parser.add_argument('-magi_results_sep','--magi_results_sep',help='delimiter for magi results file',default=',')

    # parse inputs associated with compound info file
    # parser.add_argument('-merge_compounds','--merge_compounds', help='Merge in compound info: True/False', type=bool,default=True)
    parser.add_argument('-compound_file','--compound_file', help='compound info file', required=False)
    parser.add_argument('-compound_column','--compound_column',help='column heading in compound file for compounds',default='original_compound')
    parser.add_argument('-compound_sep','--compound_sep',help='delimiter for compound file',default=',')


    #parse inputs associated with gene info file
    # parser.add_argument('-merge_genes','--merge_genes', help='Merge in gene info: True/False', type=bool,default=True)
    parser.add_argument('-gene_file','--gene_file', help='gene info file', required=False)
    parser.add_argument('-gene_column','--gene_column',help='column heading in gene file for genes',default='Gene ID')
    parser.add_argument('-gene_sep','--gene_sep',help='delimiter for gene file',default=',')

    #envoke argparser
    args = vars(parser.parse_args())
    print(args)
    #load all the dataframes
    magi_results_df = pd.read_csv(args['magi_results_file'],sep=args['magi_results_sep'])

    # #drop rows that don't have a magi score (e.g. only compound or gene match, but not both)
    magi_results_df.dropna(subset=['MAGI_score'], inplace=True)

    # print(len(magi_results_df.original_compound.unique()))
    if args['compound_file'] is not None:
        compound_df = pd.read_csv(args['compound_file'],sep=args['compound_sep'])
        #merge compound info with magi_results
        print(compound_df.columns)
        magi_results_df = pd.merge(magi_results_df,compound_df,left_on=args['magi_compound_column'],right_on=args['compound_column'],how='left')


    if args['gene_file'] is not None:
        if args['gene_sep'].startswith('xls'):
            gene_df = pd.read_excel(args['gene_file'])
        else:
            gene_df = pd.read_csv(args['gene_file'],sep=args['gene_sep'])
        #merge gene info with merged
        print(gene_df.columns)
        magi_results_df = pd.merge(magi_results_df,gene_df,left_on=args['magi_gene_column'],right_on=args['gene_column'],how='left')



    #export merged
    magi_results_df.to_csv(args['outfile'],index=None,sep=args['output_sep'])


if __name__ == "__main__":
    main()

